import { NextResponse } from "next/server";
import { generateDraft } from "@/lib/ai";
import { DiscoverySchema } from "@/lib/schema";

export async function POST(request: Request) {
  try {
    console.log("API: Received generation request");
    const body = await request.json();
    console.log("API: Body received, validating...");
    
    // Validate input
    const discovery = DiscoverySchema.parse(body.discovery);
    console.log("API: Discovery validated, generating...");

    // Generate drafts
    const { sow, proposal } = await generateDraft(discovery);
    console.log("API: Generation complete", {
      sowId: sow.id,
      proposalId: proposal.id,
      sowSections: sow.sections.length,
      proposalSections: proposal.sections.length,
    });

    return NextResponse.json({ sow, proposal });
  } catch (error: any) {
    console.error("API: Error generating draft:", error);
    console.error("API: Error details:", error.stack);
    
    // Check if it's a validation error
    if (error.name === 'ZodError') {
      console.error("API: Validation errors:", JSON.stringify(error.errors, null, 2));
      return NextResponse.json(
        { 
          error: "Invalid input data",
          details: error.errors,
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to generate draft" },
      { status: 500 }
    );
  }
}

