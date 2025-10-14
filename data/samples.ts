import { Discovery } from "@/lib/schema";

export const SAMPLE_A: Discovery = {
  client: {
    name: "TechFlow Solutions",
    industry: "SaaS",
    region: "North America",
    contact: "Sarah Chen, VP Product",
  },
  project: {
    title: "User Onboarding Transformation",
    context:
      "TechFlow's current onboarding takes 14+ days for users to reach first value. Activation rate is 32%. Marketing spend is climbing but retention is flat. Need to modernize the experience, instrument analytics, and reduce time-to-value to under 48 hours.",
    objectives: [
      "Reduce time-to-first-value from 14 days to <48 hours",
      "Increase activation rate from 32% to 65%+",
      "Build analytics foundation for onboarding funnel optimization",
      "Modernize UI/UX to match brand refresh",
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
    customNotes:
      "Existing stack: React, Node.js, PostgreSQL. Auth via Auth0. Analytics to Segment + Mixpanel. Design system partially in place (needs extension).",
  },
  constraints: {
    timelineWeeks: 12,
    budgetRange: "$150,000 - $220,000",
    compliance: ["SOC 2 Type II", "GDPR"],
  },
  risks: [
    {
      description:
        "Integration complexity with legacy auth service—unknown API surface and rate limits",
      mitigation:
        "Conduct 1-week technical spike with sandbox environment; parallel auth flow if needed",
    },
    {
      description:
        "Design system gaps may require additional component library work",
      mitigation:
        "Audit design system in Week 1; allocate contingency buffer for net-new components",
    },
  ],
  pricingPreference: "Hybrid",
  timelineWindow: {
    start: "2025-11-01",
    end: "2026-01-31",
  },
  tone: "consultative",
};

export const SAMPLE_B: Discovery = {
  client: {
    name: "RetailHub",
    industry: "E-commerce",
    region: "Global",
    contact: "Marcus Liu, Chief Digital Officer",
  },
  project: {
    title: "AI-Powered Personalization Engine",
    context:
      "RetailHub sees strong traffic but low cart conversion. Average order value (AOV) is below industry benchmarks. Want to deploy ML-driven recommendations, dynamic bundling, and A/B testing infrastructure to lift revenue per visitor.",
    objectives: [
      "Increase AOV by 20-30% through intelligent product recommendations",
      "Boost cart conversion rate by 15%",
      "Launch A/B testing framework for continuous optimization",
      "Personalize homepage and PDP experiences based on browsing behavior",
      "Build scalable ML pipeline for real-time inference",
    ],
    successCriteria: [
      "AOV increase ≥20% measured over 90 days post-launch",
      "Cart conversion lift ≥12% (statistical significance p<0.05)",
      "Recommendation click-through rate ≥8%",
      "A/B test velocity: 2+ experiments per week",
      "Model inference latency <200ms at p95",
    ],
  },
  scope: {
    modules: [
      "Data Discovery & Model Strategy",
      "ML Model Development (collaborative filtering, content-based)",
      "Recommendation API Service",
      "Frontend Integration (product carousels, dynamic bundles)",
      "A/B Testing Framework (feature flags, metrics instrumentation)",
      "Performance Optimization & Caching",
      "QA, Load Testing, and Launch Readiness",
    ],
    customNotes:
      "Stack: Next.js storefront, Python/FastAPI backend, PostgreSQL + Redis. Existing event stream via Segment. PCI-DSS compliant payment flow must remain untouched.",
  },
  constraints: {
    timelineWeeks: 8,
    budgetRange: "$100,000 - $140,000",
    compliance: ["PCI DSS (no changes to payment flow)"],
  },
  risks: [
    {
      description:
        "Cold-start problem for new users with limited browsing history",
      mitigation:
        "Implement fallback to popularity-based recommendations and collect implicit signals (time-on-page, scroll depth)",
    },
  ],
  pricingPreference: "TM",
  timelineWindow: {
    start: "2025-10-20",
    end: "2025-12-15",
  },
  tone: "friendly",
};

export const SAMPLES = {
  A: SAMPLE_A,
  B: SAMPLE_B,
};

