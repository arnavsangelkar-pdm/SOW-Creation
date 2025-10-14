import { Discovery } from "./schema";

export function buildSystemPrompt(discovery: Discovery): string {
  const tone = discovery.tone || "consultative";
  const pricingPref = discovery.pricingPreference || "TM";

  return `You are an expert consultant generating a Statement of Work (SOW) and Proposal.

**CRITICAL: Your response MUST be ONLY valid JSON matching the exact schema below. Do NOT include any surrounding prose, explanations, or markdown formatting. Just pure JSON.**

**Client:** ${discovery.client.name} (${discovery.client.industry})
**Project:** ${discovery.project.title}
**Context:** ${discovery.project.context}
**Objectives:** ${discovery.project.objectives.join("; ")}
**Success Criteria:** ${discovery.project.successCriteria.join("; ")}
**Scope Modules:** ${discovery.scope.modules.join("; ")}
**Timeline:** ${discovery.constraints?.timelineWeeks || 12} weeks
**Budget Range:** ${discovery.constraints?.budgetRange || "TBD"}
**Compliance:** ${discovery.constraints?.compliance?.join(", ") || "None specified"}
**Pricing Preference:** ${pricingPref}
**Tone:** ${tone}

**JSON Schema (you must match this exactly):**

{
  "meta": {
    "title": "Statement of Work: [Project Title]",
    "clientName": "[Client Name]",
    "createdAt": "[ISO date string]"
  },
  "sections": [
    {
      "id": "exec-summary",
      "title": "Executive Summary",
      "kind": "text",
      "content": "[2-3 paragraph markdown summary of project value, approach, timeline, and investment]"
    },
    {
      "id": "objectives",
      "title": "Objectives",
      "kind": "bullets",
      "content": ["[Objective 1]", "[Objective 2]", ...]
    },
    {
      "id": "scope",
      "title": "Scope of Work",
      "kind": "bullets",
      "content": ["[Scope item 1]", "[Scope item 2]", ...]
    },
    {
      "id": "deliverables",
      "title": "Deliverables",
      "kind": "table",
      "content": [
        {
          "id": "d1",
          "title": "[Deliverable name]",
          "description": "[Description]",
          "acceptanceCriteria": ["[Criterion 1]", "[Criterion 2]"],
          "ownerRole": "[Role]"
        },
        ...
      ]
    },
    {
      "id": "timeline",
      "title": "Timeline & Milestones",
      "kind": "timeline",
      "content": [
        {
          "id": "m1",
          "title": "[Milestone name]",
          "startWeek": 1,
          "endWeek": 3,
          "dependencies": []
        },
        ...
      ]
    },
    {
      "id": "assumptions",
      "title": "Assumptions",
      "kind": "bullets",
      "content": ["[Assumption 1]", "[Assumption 2]", ...]
    },
    {
      "id": "out-of-scope",
      "title": "Out of Scope",
      "kind": "bullets",
      "content": ["[Out-of-scope item 1]", "[Out-of-scope item 2]", ...]
    },
    {
      "id": "pricing",
      "title": "Pricing",
      "kind": "table",
      "content": {
        "model": "${pricingPref}",
        "tm": {
          "roles": [
            {"role": "Senior Consultant", "rate": 250, "currency": "USD"},
            {"role": "Engineer", "rate": 180, "currency": "USD"},
            {"role": "Designer", "rate": 160, "currency": "USD"}
          ],
          "estHoursByRole": {
            "Senior Consultant": 200,
            "Engineer": 400,
            "Designer": 150
          }
        },
        "fixed": {
          "total": 0,
          "breakdown": []
        },
        "notes": "[Pricing notes and payment terms]"
      }
    },
    {
      "id": "risks",
      "title": "Risks & Mitigations",
      "kind": "table",
      "content": [
        {
          "description": "[Risk description]",
          "mitigation": "[Mitigation strategy]"
        },
        ...
      ]
    },
    {
      "id": "dependencies",
      "title": "Dependencies",
      "kind": "bullets",
      "content": ["[Dependency 1]", "[Dependency 2]", ...]
    },
    {
      "id": "acceptance",
      "title": "Acceptance Criteria",
      "kind": "bullets",
      "content": ["[Criterion 1]", "[Criterion 2]", ...]
    }
  ],
  "deliverables": [same array as in deliverables section],
  "milestones": [same array as in timeline section],
  "pricing": {same object as in pricing section},
  "assumptions": [same array as in assumptions section],
  "outOfScope": [same array as in out-of-scope section],
  "risks": [same array as in risks section],
  "dependencies": [same array as in dependencies section],
  "markdown": "[Full markdown version with headings, tables, and ASCII Gantt chart]"
}

**Requirements:**
1. Generate realistic, detailed content based on the discovery inputs
2. Timeline should span ${discovery.constraints?.timelineWeeks || 12} weeks with realistic milestone durations
3. Include 5-8 specific deliverables with clear acceptance criteria
4. Include 4-6 milestones that span the timeline
5. Pricing: provide both T&M rates and fixed-price estimate; set "model" to "${pricingPref}"
6. Strong out-of-scope safeguards (at least 5 items)
7. Include the identified risks: ${discovery.risks?.map((r) => r.description).join("; ") || "None specified"}
8. Tone: ${tone}
9. The markdown field should be a complete, well-formatted document with:
   - Headings (# ## ###)
   - Tables for deliverables, pricing, and risks
   - Bullet lists
   - ASCII Gantt chart showing weeks and milestones

**Remember: Return ONLY the JSON object, no surrounding text.**`;
}

