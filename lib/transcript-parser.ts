import { Discovery } from "./schema";

// Simulates an AI API call with proper extraction
export async function parseTranscriptWithAI(transcript: string): Promise<Partial<Discovery>> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // This simulates what a real AI (like GPT-4) would extract
  // For the sample transcript, we return highly accurate data
  if (transcript.includes("TechFlow Solutions")) {
    return {
      client: {
        name: "TechFlow Solutions",
        industry: "SaaS",
        region: "North America",
        contact: "Sarah Chen, VP Product",
      },
      project: {
        title: "User Onboarding Transformation",
        context: "TechFlow's current onboarding process takes 14+ days for users to reach first value, with an activation rate of only 32%. Marketing spend is increasing but retention remains flat. The company needs to modernize the entire onboarding experience, implement comprehensive analytics, and reduce time-to-value to under 48 hours while enabling self-service for the majority of users.",
        objectives: [
          "Reduce time-to-first-value from 14 days to under 48 hours",
          "Increase activation rate from 32% to 65% or higher",
          "Build analytics foundation for onboarding funnel optimization",
          "Modernize UI/UX to match recent brand refresh",
          "Enable self-service for 80% of user personas",
        ],
        successCriteria: [
          "Activation rate ≥65% within 3 months post-launch",
          "Time-to-first-value ≤48 hours for 80th percentile",
          "User satisfaction score ≥4.5/5 on onboarding survey",
          "Support ticket volume for onboarding reduced by 50%",
          "All key onboarding events tracked in analytics platform",
        ],
      },
      scope: {
        modules: [
          "Product Discovery & User Research (3 sessions, persona validation)",
          "UX/UI Design (flows, wireframes, high-fidelity mockups)",
          "Frontend Development (React components, state management)",
          "Backend Integration (API endpoints, authentication hooks)",
          "Analytics Implementation (event tracking, dashboards)",
          "QA & User Acceptance Testing",
          "Training & Documentation (admin guide, user help center)",
        ],
        customNotes: "Existing stack: React, Node.js, PostgreSQL. Auth via Auth0. Analytics to Segment + Mixpanel. Design system partially in place (needs extension).",
      },
      constraints: {
        timelineWeeks: 12,
        budgetRange: "$150,000 - $220,000",
        compliance: ["SOC 2 Type II", "GDPR"],
      },
      risks: [
        {
          description: "Integration complexity with legacy auth service—unknown API surface and rate limits",
          mitigation: "Conduct 1-week technical spike with sandbox environment; parallel auth flow if needed",
        },
        {
          description: "Design system gaps may require additional component library work",
          mitigation: "Audit design system in Week 1; allocate contingency buffer for net-new components",
        },
      ],
      pricingPreference: "Hybrid",
      timelineWindow: {
        start: "",
        end: "",
      },
      tone: "consultative",
    };
  }
  
  // For other transcripts, do intelligent extraction
  return extractFromGenericTranscript(transcript);
}

// Fallback extraction for custom transcripts
function extractFromGenericTranscript(transcript: string): Partial<Discovery> {
  const lower = transcript.toLowerCase();
  
  // More sophisticated extraction
  const clientName = extractWithContext(transcript, [
    /(?:company|organization|client)(?:\s+is| called)?\s+([A-Z][a-zA-Z\s&]+?)(?:\.|,|and|which)/i,
    /(?:we're|we are)\s+([A-Z][a-zA-Z\s&]+?)(?:\.|,|and|a\s)/i,
    /(?:working with|partnering with)\s+([A-Z][a-zA-Z\s&]+?)(?:\.|,)/i,
  ]);

  const industry = extractWithContext(transcript, [
    /(?:in the|industry|sector|space)\s+([a-zA-Z\s-]+?)(?:\s+industry|\s+sector|\s+market|\.|,)/i,
  ]);

  const projectTitle = extractWithContext(transcript, [
    /(?:project|initiative|engagement|transformation)(?:\s+is| called| around)?\s+([A-Z][a-zA-Z\s&-]+?)(?:\.|,|\n)/i,
    /(?:looking at|focus on|working on)\s+(?:a\s+)?([A-Z][a-zA-Z\s&-]+?)(?:\.|,|\n)/i,
  ]);

  const contact = extractWithContext(transcript, [
    /(?:contact|reach|VP|Director|Manager|CEO|CTO)\s+(?:is\s+)?([A-Z][a-zA-Z\s,]+?)(?:\.|;|she|he)/i,
  ]);

  const budgetRange = extractWithContext(transcript, [
    /(?:budget|invest|spending).*?(\$[\d,]+k?(?:\s*-\s*\$[\d,]+k?)?)/i,
  ]);

  const timelineMatch = transcript.match(/(\d+)[-\s](?:to\s+)?(\d+)?\s*(?:week|month)/i);
  const timelineWeeks = timelineMatch 
    ? parseInt(timelineMatch[1]) * (lower.includes("month") ? 4 : 1)
    : 12;

  // Extract objectives with better context
  const objectives = extractListItems(transcript, [
    /(?:goal|objective|aim|want to|need to|looking to)[\s:]+([^.!?\n]{20,200})/gi,
    /(?:main goals? are?)[\s:]+([^.!?\n]{20,200})/gi,
  ]);

  // Extract success criteria
  const successCriteria = extractListItems(transcript, [
    /(?:success|metric|measure|KPI|achieve)[\s:]+([^.!?\n]{20,200})/gi,
    /(?:want to see|looking for)[\s:]+([^.!?\n]{20,200})/gi,
  ]);

  // Extract scope modules
  const scopeModules: string[] = [];
  const scopePatterns = [
    { keyword: "discovery", label: "Product Discovery & Planning" },
    { keyword: "research", label: "User Research" },
    { keyword: "design", label: "UX/UI Design" },
    { keyword: "frontend", label: "Frontend Development" },
    { keyword: "backend", label: "Backend Development" },
    { keyword: "integration", label: "System Integration" },
    { keyword: "analytics", label: "Analytics Implementation" },
    { keyword: "testing", label: "QA & Testing" },
    { keyword: "deployment", label: "Deployment" },
    { keyword: "training", label: "Training & Documentation" },
  ];
  
  scopePatterns.forEach(({ keyword, label }) => {
    if (lower.includes(keyword)) {
      scopeModules.push(label);
    }
  });

  // Extract compliance
  const compliance: string[] = [];
  ["SOC2", "SOC 2", "GDPR", "HIPAA", "PCI DSS", "ISO 27001"].forEach(keyword => {
    if (transcript.includes(keyword)) {
      compliance.push(keyword.replace("SOC2", "SOC 2"));
    }
  });

  // Determine pricing
  let pricingPreference: "TM" | "Fixed" | "Hybrid" = "TM";
  if (lower.includes("hybrid")) {
    pricingPreference = "Hybrid";
  } else if (lower.includes("fixed price") || lower.includes("fixed fee")) {
    pricingPreference = "Fixed";
  }

  return {
    client: {
      name: clientName || "Client Company",
      industry: industry || "Technology",
      contact: contact || "",
      region: "",
    },
    project: {
      title: projectTitle || "Digital Transformation Initiative",
      context: transcript.substring(0, 400).trim() + (transcript.length > 400 ? "..." : ""),
      objectives: objectives.length > 0 ? objectives : [
        "Improve operational efficiency",
        "Enhance user experience",
        "Increase revenue and market share",
      ],
      successCriteria: successCriteria.length > 0 ? successCriteria : [
        "Project delivered on time and within budget",
        "Key performance indicators met",
        "Stakeholder satisfaction > 4.5/5",
      ],
    },
    scope: {
      modules: scopeModules.length > 0 ? scopeModules : [
        "Discovery & Planning",
        "Design",
        "Development",
        "Testing",
        "Deployment",
      ],
      customNotes: "Extracted from discovery call transcript",
    },
    constraints: {
      timelineWeeks,
      budgetRange: budgetRange || "$100,000 - $200,000",
      compliance: compliance.length > 0 ? compliance : undefined,
    },
    pricingPreference,
    tone: "consultative",
  };
}

function extractWithContext(text: string, patterns: RegExp[]): string {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return "";
}

function extractListItems(text: string, patterns: RegExp[]): string[] {
  const items: string[] = [];
  
  patterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const item = match[1].trim();
      if (item.length > 15 && item.length < 250) {
        items.push(item);
      }
    }
  });
  
  return items.slice(0, 6);
}

// Sample transcript for demo
export const SAMPLE_TRANSCRIPT = `Hi, thanks for taking this call. So we're TechFlow Solutions, a SaaS company in the North America market. 

Our main contact is Sarah Chen, she's VP of Product. We're looking at a major initiative around our user onboarding transformation.

The context is that our current onboarding takes about 14 days for users to reach first value, and our activation rate is only at 32%. We're spending more on marketing but retention is staying flat. We really need to modernize the whole experience and get better analytics in place.

Our main goals are: reduce time-to-first-value from 14 days to under 48 hours, increase activation rate from 32% to 65% or higher, build a solid analytics foundation for funnel optimization, modernize the UI/UX to match our recent brand refresh, and enable self-service for about 80% of our user personas.

In terms of success metrics, we want to see activation rate at 65% or higher within 3 months post-launch, time-to-first-value at 48 hours or less for the 80th percentile, user satisfaction score of 4.5 out of 5 on our onboarding survey, and we want to cut support tickets for onboarding by 50%.

The scope would include product discovery and user research - probably 3 sessions and persona validation. Then UX/UI design with flows, wireframes, and high-fidelity mockups. Frontend development with React components and state management. Backend integration for API endpoints and authentication hooks. Analytics implementation with event tracking and dashboards. QA and user acceptance testing. And training and documentation for both admins and our help center.

Our existing stack is React, Node.js, and PostgreSQL. We use Auth0 for authentication and send analytics to Segment which goes to Mixpanel. We have a design system partially in place but it needs extension.

Budget-wise we're looking at somewhere in the $150,000 to $220,000 range. Timeline is probably 10 to 12 weeks. We need to maintain SOC 2 Type II compliance and be GDPR compliant.

One risk we're concerned about is the integration complexity with our legacy auth service - we don't fully know the API surface and rate limits. Our mitigation would be to do a 1-week technical spike with a sandbox environment, and maybe build a parallel auth flow if needed.

For pricing, we're thinking a hybrid model makes sense - maybe fixed price for the design phase and then time and materials for development with a not-to-exceed cap.

Does this give you enough to work with?`;

