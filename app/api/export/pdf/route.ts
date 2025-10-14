import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { draft } = await request.json();

    // Simple PDF generation using markdown content
    // In production, use @react-pdf/renderer or similar
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${draft.meta.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1 { font-size: 28px; margin-top: 40px; color: #1a1a1a; }
    h2 { font-size: 22px; margin-top: 32px; color: #2a2a2a; border-bottom: 2px solid #e5e5e5; padding-bottom: 8px; }
    h3 { font-size: 18px; margin-top: 24px; color: #3a3a3a; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #f5f5f5; font-weight: 600; }
    pre { background: #f5f5f5; padding: 16px; border-radius: 4px; overflow-x: auto; }
    .header { border-bottom: 3px solid #4f46e5; padding-bottom: 20px; margin-bottom: 40px; }
    .meta { color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${draft.meta.title}</h1>
    <div class="meta">
      <p><strong>Client:</strong> ${draft.meta.clientName}</p>
      <p><strong>Date:</strong> ${new Date(draft.meta.createdAt).toLocaleDateString()}</p>
    </div>
  </div>
  <div>
    ${markdownToHTML(draft.markdown)}
  </div>
</body>
</html>
    `;

    // Return HTML that can be saved as PDF using browser's print to PDF
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="${draft.meta.title.replace(/[^a-z0-9]/gi, "_")}.html"`,
      },
    });
  } catch (error: any) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

function markdownToHTML(markdown: string): string {
  // Basic markdown to HTML conversion
  let html = markdown
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^- (.*$)/gim, "<li>$1</li>")
    .replace(/```([\s\S]*?)```/g, "<pre>$1</pre>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>");

  // Wrap list items
  html = html.replace(/(<li>.*<\/li>)+/g, "<ul>$&</ul>");

  return `<p>${html}</p>`;
}

