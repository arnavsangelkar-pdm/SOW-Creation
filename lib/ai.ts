import { Discovery, DocumentDraft, Deliverable, Milestone } from "./schema";
import { buildSystemPrompt } from "./prompts";
import { generateId } from "./storage";

export async function generateDraft(
  discovery: Discovery
): Promise<{ sow: DocumentDraft; proposal: DocumentDraft }> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && apiKey.length > 0) {
    return await generateWithOpenAI(discovery, apiKey);
  } else {
    return generateMockDraft(discovery);
  }
}

async function generateWithOpenAI(
  discovery: Discovery,
  apiKey: string
): Promise<{ sow: DocumentDraft; proposal: DocumentDraft }> {
  const systemPrompt = buildSystemPrompt(discovery);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Generate SOW for: ${JSON.stringify(discovery)}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error, falling back to mock");
      return generateMockDraft(discovery);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse JSON response
    const parsed = JSON.parse(content);

    const sow: DocumentDraft = {
      id: generateId("doc"),
      status: "Draft",
      ...parsed,
    };

    // For now, proposal is same as SOW (could be customized)
    const proposal: DocumentDraft = {
      ...sow,
      id: generateId("doc"),
      meta: {
        ...sow.meta,
        title: sow.meta.title.replace("Statement of Work", "Proposal"),
      },
    };

    return { sow, proposal };
  } catch (error) {
    console.error("Error calling OpenAI, falling back to mock:", error);
    return generateMockDraft(discovery);
  }
}

function generateMockDraft(
  discovery: Discovery
): { sow: DocumentDraft; proposal: DocumentDraft } {
  const timelineWeeks = discovery.constraints?.timelineWeeks || 12;
  const clientName = discovery.client.name;
  const projectTitle = discovery.project.title;

  // Generate deliverables from scope modules
  const deliverables: Deliverable[] = discovery.scope.modules.map((module, i) => ({
    id: `d${i + 1}`,
    title: module,
    description: `Complete ${module.toLowerCase()} with documentation and quality assurance`,
    acceptanceCriteria: [
      `All ${module.toLowerCase()} requirements met`,
      "Documentation provided",
      "Stakeholder sign-off obtained",
    ],
    ownerRole: i % 3 === 0 ? "Senior Consultant" : i % 3 === 1 ? "Engineer" : "Designer",
  }));

  // Generate milestones
  const numModules = discovery.scope.modules.length;
  const weeksPerMilestone = Math.floor(timelineWeeks / Math.min(numModules, 6));
  const milestones: Milestone[] = [];

  let currentWeek = 1;
  const milestoneGroups = [
    { title: "Discovery & Planning", modules: discovery.scope.modules.slice(0, 1) },
    { title: "Design & Architecture", modules: discovery.scope.modules.slice(1, 3) },
    { title: "Development Phase 1", modules: discovery.scope.modules.slice(3, 5) },
    { title: "Development Phase 2", modules: discovery.scope.modules.slice(5, 7) },
    { title: "Testing & QA", modules: ["Quality Assurance", "User Acceptance Testing"] },
    { title: "Launch & Handoff", modules: ["Deployment", "Training", "Documentation"] },
  ];

  milestoneGroups.forEach((group, i) => {
    const duration = i === 0 ? 2 : weeksPerMilestone;
    const endWeek = Math.min(currentWeek + duration - 1, timelineWeeks);

    if (currentWeek <= timelineWeeks) {
      milestones.push({
        id: `m${i + 1}`,
        title: group.title,
        startWeek: currentWeek,
        endWeek: endWeek,
        dependencies: i > 0 ? [`m${i}`] : [],
      });
      currentWeek = endWeek + 1;
    }
  });

  // Pricing
  const pricingModel = discovery.pricingPreference || "TM";
  const pricing = {
    model: pricingModel,
    tm: {
      roles: [
        { role: "Senior Consultant", rate: 250, currency: "USD" },
        { role: "Engineer", rate: 180, currency: "USD" },
        { role: "Designer", rate: 160, currency: "USD" },
        { role: "QA Specialist", rate: 140, currency: "USD" },
      ],
      estHoursByRole: {
        "Senior Consultant": Math.floor(timelineWeeks * 20),
        Engineer: Math.floor(timelineWeeks * 40),
        Designer: Math.floor(timelineWeeks * 15),
        "QA Specialist": Math.floor(timelineWeeks * 10),
      },
    },
    fixed: {
      total: parseFixedPrice(discovery.constraints?.budgetRange),
      breakdown: [
        { item: "Discovery & Planning", amount: 15000 },
        { item: "Design & UX", amount: 25000 },
        { item: "Development", amount: 80000 },
        { item: "Testing & QA", amount: 20000 },
        { item: "Launch & Training", amount: 10000 },
      ],
    },
    notes:
      pricingModel === "TM"
        ? "Time & Materials billing with monthly invoicing. Rates locked for duration of engagement."
        : pricingModel === "Fixed"
        ? "Fixed price with milestone-based payments. 30% upfront, 40% at mid-point, 30% at completion."
        : "Hybrid model: Fixed price for design phase, T&M for development with NTE cap.",
  };

  const assumptions = [
    `Client provides timely access to systems, data, and stakeholders`,
    `Existing technical infrastructure is documented and accessible`,
    `Key stakeholders available for weekly sync meetings`,
    `Client has internal resources for UAT and acceptance testing`,
    `No major scope changes after kickoff; change requests via formal process`,
    `Compliance requirements are fully documented upfront`,
  ];

  const outOfScope = [
    "Third-party vendor management or procurement",
    "Hardware infrastructure or cloud account setup",
    "Ongoing maintenance and support post-launch (available separately)",
    "Training for end-users beyond admin/power users",
    "Data migration from legacy systems",
    "Integration with systems not identified in discovery",
    "Custom reporting beyond specified dashboards",
    "Mobile app development (web-responsive only)",
  ];

  const risks = discovery.risks || [
    {
      description: "Technical complexity may require additional discovery",
      mitigation: "Allocate spike weeks for unknowns; maintain contingency buffer",
    },
  ];

  const dependencies = [
    "Client provides API documentation and sandbox access by Week 1",
    "Design approval within 5 business days of presentation",
    "Stakeholder availability for weekly checkpoints",
    "UAT environment provisioned by start of testing phase",
  ];

  // Generate markdown
  const markdown = generateMarkdown({
    clientName,
    projectTitle,
    deliverables,
    milestones,
    pricing,
    assumptions,
    outOfScope,
    risks,
    dependencies,
    discovery,
  });

  const sections = [
    {
      id: "exec-summary",
      title: "Executive Summary",
      kind: "text" as const,
      content: `This Statement of Work outlines our proposed approach to deliver **${projectTitle}** for ${clientName}. Our engagement will span **${timelineWeeks} weeks** and focus on ${discovery.project.objectives.slice(0, 2).join(" and ")}.

We will leverage a ${pricingModel === "TM" ? "time & materials" : pricingModel === "Fixed" ? "fixed-price" : "hybrid"} model to ensure flexibility and value alignment. Our team brings deep expertise in ${discovery.client.industry} and a proven track record of delivering ${discovery.scope.modules.length}+ work streams on time and within budget.

**Key outcomes:** ${discovery.project.successCriteria.slice(0, 2).join(", ")}.`,
    },
    {
      id: "objectives",
      title: "Objectives",
      kind: "bullets" as const,
      content: discovery.project.objectives,
    },
    {
      id: "scope",
      title: "Scope of Work",
      kind: "bullets" as const,
      content: discovery.scope.modules,
    },
    {
      id: "deliverables",
      title: "Deliverables",
      kind: "table" as const,
      content: deliverables,
    },
    {
      id: "timeline",
      title: "Timeline & Milestones",
      kind: "timeline" as const,
      content: milestones,
    },
    {
      id: "assumptions",
      title: "Assumptions",
      kind: "bullets" as const,
      content: assumptions,
    },
    {
      id: "out-of-scope",
      title: "Out of Scope",
      kind: "bullets" as const,
      content: outOfScope,
    },
    {
      id: "pricing",
      title: "Pricing",
      kind: "table" as const,
      content: pricing,
    },
    {
      id: "risks",
      title: "Risks & Mitigations",
      kind: "table" as const,
      content: risks,
    },
    {
      id: "dependencies",
      title: "Dependencies",
      kind: "bullets" as const,
      content: dependencies,
    },
    {
      id: "acceptance",
      title: "Acceptance Criteria",
      kind: "bullets" as const,
      content: discovery.project.successCriteria,
    },
  ];

  const sow: DocumentDraft = {
    id: generateId("doc"),
    status: "Draft",
    meta: {
      title: `Statement of Work: ${projectTitle}`,
      clientName: clientName,
      createdAt: new Date().toISOString(),
    },
    sections,
    deliverables,
    milestones,
    pricing,
    assumptions,
    outOfScope,
    risks,
    dependencies,
    markdown,
  };

  const proposal: DocumentDraft = {
    ...sow,
    id: generateId("doc"),
    meta: {
      ...sow.meta,
      title: `Proposal: ${projectTitle}`,
    },
  };

  return { sow, proposal };
}

function parseFixedPrice(budgetRange?: string): number {
  if (!budgetRange) return 150000;

  const match = budgetRange.match(/[\d,]+/g);
  if (match && match.length > 0) {
    const first = match[0].replace(/,/g, "");
    return parseInt(first, 10);
  }

  return 150000;
}

function generateMarkdown(params: {
  clientName: string;
  projectTitle: string;
  deliverables: Deliverable[];
  milestones: Milestone[];
  pricing: any;
  assumptions: string[];
  outOfScope: string[];
  risks: any[];
  dependencies: string[];
  discovery: Discovery;
}): string {
  const {
    clientName,
    projectTitle,
    deliverables,
    milestones,
    pricing,
    assumptions,
    outOfScope,
    risks,
    dependencies,
    discovery,
  } = params;

  let md = `# Statement of Work: ${projectTitle}\n\n`;
  md += `**Client:** ${clientName}  \n`;
  md += `**Industry:** ${discovery.client.industry}  \n`;
  md += `**Date:** ${new Date().toLocaleDateString()}  \n\n`;

  md += `## Executive Summary\n\n`;
  md += `This engagement will deliver **${projectTitle}** with a focus on ${discovery.project.objectives.slice(0, 2).join(" and ")}.  \n\n`;

  md += `## Objectives\n\n`;
  discovery.project.objectives.forEach((obj) => {
    md += `- ${obj}\n`;
  });
  md += `\n`;

  md += `## Scope of Work\n\n`;
  discovery.scope.modules.forEach((mod) => {
    md += `- ${mod}\n`;
  });
  md += `\n`;

  md += `## Deliverables\n\n`;
  md += `| Title | Description | Owner |\n`;
  md += `|-------|-------------|-------|\n`;
  deliverables.forEach((d) => {
    md += `| ${d.title} | ${d.description} | ${d.ownerRole || "TBD"} |\n`;
  });
  md += `\n`;

  md += `## Timeline & Milestones\n\n`;
  milestones.forEach((m) => {
    md += `- **${m.title}** (Weeks ${m.startWeek}-${m.endWeek})\n`;
  });
  md += `\n`;

  md += `### Gantt Chart (ASCII)\n\n`;
  md += "```\n";
  const maxWeek = Math.max(...milestones.map((m) => m.endWeek));
  md += "Week:  ";
  for (let w = 1; w <= maxWeek; w++) {
    md += `${w.toString().padStart(3)} `;
  }
  md += "\n";
  md += "       " + "----".repeat(maxWeek) + "\n";

  milestones.forEach((m) => {
    md += m.title.padEnd(7).substring(0, 7) + " ";
    for (let w = 1; w <= maxWeek; w++) {
      if (w >= m.startWeek && w <= m.endWeek) {
        md += "███ ";
      } else {
        md += "    ";
      }
    }
    md += "\n";
  });
  md += "```\n\n";

  md += `## Pricing\n\n`;
  md += `**Model:** ${pricing.model}  \n\n`;

  if (pricing.tm) {
    md += `### Time & Materials Rates\n\n`;
    md += `| Role | Rate | Est. Hours |\n`;
    md += `|------|------|------------|\n`;
    pricing.tm.roles.forEach((r: any) => {
      const hours = pricing.tm.estHoursByRole[r.role] || 0;
      md += `| ${r.role} | $${r.rate}/${r.currency} | ${hours} |\n`;
    });
    md += `\n`;
  }

  if (pricing.fixed) {
    md += `### Fixed Price: $${pricing.fixed.total.toLocaleString()}\n\n`;
    if (pricing.fixed.breakdown) {
      md += `| Item | Amount |\n`;
      md += `|------|--------|\n`;
      pricing.fixed.breakdown.forEach((b: any) => {
        md += `| ${b.item} | $${b.amount.toLocaleString()} |\n`;
      });
      md += `\n`;
    }
  }

  md += `**Notes:** ${pricing.notes}\n\n`;

  md += `## Assumptions\n\n`;
  assumptions.forEach((a) => {
    md += `- ${a}\n`;
  });
  md += `\n`;

  md += `## Out of Scope\n\n`;
  outOfScope.forEach((o) => {
    md += `- ${o}\n`;
  });
  md += `\n`;

  md += `## Risks & Mitigations\n\n`;
  md += `| Risk | Mitigation |\n`;
  md += `|------|------------|\n`;
  risks.forEach((r) => {
    md += `| ${r.description} | ${r.mitigation} |\n`;
  });
  md += `\n`;

  md += `## Dependencies\n\n`;
  dependencies.forEach((d) => {
    md += `- ${d}\n`;
  });
  md += `\n`;

  md += `## Acceptance Criteria\n\n`;
  discovery.project.successCriteria.forEach((c) => {
    md += `- ${c}\n`;
  });
  md += `\n`;

  return md;
}

