import { z } from "zod";

// Brand configuration
export const OrgBrandSchema = z.object({
  name: z.string(),
  logoUrl: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  tone: z.enum(["formal", "consultative", "friendly"]).optional(),
});

export type OrgBrand = z.infer<typeof OrgBrandSchema>;

// Discovery input
export const DiscoverySchema = z.object({
  client: z.object({
    name: z.string(),
    industry: z.string(),
    region: z.string().optional(),
    contact: z.string().optional(),
  }),
  project: z.object({
    title: z.string(),
    context: z.string(),
    objectives: z.array(z.string()),
    successCriteria: z.array(z.string()),
  }),
  scope: z.object({
    modules: z.array(z.string()),
    customNotes: z.string().optional(),
  }),
  constraints: z
    .object({
      timelineWeeks: z.number().optional(),
      budgetRange: z.string().optional(),
      compliance: z.array(z.string()).optional(),
    })
    .optional(),
  risks: z
    .array(
      z.object({
        description: z.string(),
        mitigation: z.string(),
      })
    )
    .optional(),
  pricingPreference: z.enum(["TM", "Fixed", "Hybrid"]).optional(),
  timelineWindow: z
    .object({
      start: z.string().optional(),
      end: z.string().optional(),
    })
    .optional(),
  tone: z.enum(["formal", "consultative", "friendly"]).optional(),
});

export type Discovery = z.infer<typeof DiscoverySchema>;

// Deliverable
export const DeliverableSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  acceptanceCriteria: z.array(z.string()),
  ownerRole: z.string().optional(),
});

export type Deliverable = z.infer<typeof DeliverableSchema>;

// Milestone
export const MilestoneSchema = z.object({
  id: z.string(),
  title: z.string(),
  startWeek: z.number(),
  endWeek: z.number(),
  dependencies: z.array(z.string()).optional(),
});

export type Milestone = z.infer<typeof MilestoneSchema>;

// Pricing
export const RoleRateSchema = z.object({
  role: z.string(),
  rate: z.number(),
  currency: z.string(),
});

export type RoleRate = z.infer<typeof RoleRateSchema>;

export const PricingTableSchema = z.object({
  model: z.enum(["TM", "Fixed", "Hybrid"]),
  tm: z
    .object({
      roles: z.array(RoleRateSchema),
      estHoursByRole: z.record(z.string(), z.number()),
    })
    .optional(),
  fixed: z
    .object({
      total: z.number(),
      breakdown: z
        .array(
          z.object({
            item: z.string(),
            amount: z.number(),
          })
        )
        .optional(),
    })
    .optional(),
  notes: z.string().optional(),
});

export type PricingTable = z.infer<typeof PricingTableSchema>;

// Section
export const SectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  kind: z.enum(["text", "table", "timeline", "bullets"]),
  content: z.any(),
});

export type Section = z.infer<typeof SectionSchema>;

// Document Draft
export const DocumentDraftSchema = z.object({
  id: z.string(),
  status: z.enum(["Draft", "In Review", "Approved"]),
  brand: OrgBrandSchema.optional(),
  meta: z.object({
    title: z.string(),
    clientName: z.string(),
    createdAt: z.string(),
  }),
  sections: z.array(SectionSchema),
  deliverables: z.array(DeliverableSchema),
  milestones: z.array(MilestoneSchema),
  pricing: PricingTableSchema,
  assumptions: z.array(z.string()),
  outOfScope: z.array(z.string()),
  risks: z.array(
    z.object({
      description: z.string(),
      mitigation: z.string(),
    })
  ),
  dependencies: z.array(z.string()),
  markdown: z.string(),
});

export type DocumentDraft = z.infer<typeof DocumentDraftSchema>;

// Change tracking
export const ChangeSchema = z.object({
  id: z.string(),
  sectionId: z.string(),
  before: z.string(),
  after: z.string(),
  author: z.string(),
  timestamp: z.string(),
  status: z.enum(["pending", "accepted", "rejected"]),
});

export type Change = z.infer<typeof ChangeSchema>;

// Comment
export const CommentSchema = z.object({
  id: z.string(),
  sectionId: z.string(),
  content: z.string(),
  author: z.string(),
  timestamp: z.string(),
  resolved: z.boolean(),
  replies: z.array(
    z.object({
      id: z.string(),
      content: z.string(),
      author: z.string(),
      timestamp: z.string(),
    })
  ),
});

export type Comment = z.infer<typeof CommentSchema>;

// Version
export const VersionSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  description: z.string(),
  draft: DocumentDraftSchema,
});

export type Version = z.infer<typeof VersionSchema>;

// Workspace state
export const WorkspaceSchema = z.object({
  sow: DocumentDraftSchema.optional(),
  proposal: DocumentDraftSchema.optional(),
  versions: z.array(VersionSchema),
  changes: z.array(ChangeSchema),
  comments: z.array(CommentSchema),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;

