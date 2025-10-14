import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { draft } = await request.json();

    // Simple text export (in production, use docx library)
    // For now, return markdown as text
    const content = `${draft.meta.title}\n\n${draft.markdown}`;

    return new NextResponse(content, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${draft.meta.title.replace(/[^a-z0-9]/gi, "_")}.txt"`,
      },
    });
  } catch (error: any) {
    console.error("Error generating DOCX:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate DOCX" },
      { status: 500 }
    );
  }
}

