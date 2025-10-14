import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { draft } = await request.json();

    // Export as text file (in production, use docx library for real .docx format)
    let content = `${draft.meta.title}\n`;
    content += `${"=".repeat(draft.meta.title.length)}\n\n`;
    content += `Client: ${draft.meta.clientName}\n`;
    content += `Date: ${new Date(draft.meta.createdAt).toLocaleDateString()}\n\n`;
    content += `${draft.markdown}`;

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
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

