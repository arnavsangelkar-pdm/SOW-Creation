import { NextResponse } from "next/server";
import { generateDraft } from "@/lib/ai";
import { DiscoverySchema } from "@/lib/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const discovery = DiscoverySchema.parse(body.discovery);

    // Generate drafts
    const { sow, proposal } = await generateDraft(discovery);

    return NextResponse.json({ sow, proposal });
  } catch (error: any) {
    console.error("Error generating draft:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate draft" },
      { status: 500 }
    );
  }
}

