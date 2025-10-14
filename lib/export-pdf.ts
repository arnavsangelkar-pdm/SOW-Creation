import { DocumentDraft } from "./schema";

export async function exportToPDF(draft: DocumentDraft): Promise<void> {
  // Create a print-friendly HTML view
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${draft.meta.title}</title>
  <style>
    @page {
      margin: 1in;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
    }
    .cover {
      text-align: center;
      padding: 120px 0;
      page-break-after: always;
    }
    .cover h1 {
      font-size: 36px;
      margin-bottom: 24px;
    }
    .cover .meta {
      font-size: 18px;
      color: #666;
    }
    h1 { font-size: 28px; margin: 40px 0 16px; border-bottom: 2px solid #4f46e5; padding-bottom: 8px; }
    h2 { font-size: 22px; margin: 32px 0 12px; color: #2a2a2a; }
    h3 { font-size: 18px; margin: 24px 0 8px; color: #3a3a3a; }
    p { margin: 12px 0; }
    ul { margin: 12px 0; padding-left: 24px; }
    li { margin: 6px 0; }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 20px 0; 
      font-size: 14px;
    }
    th, td { 
      border: 1px solid #ddd; 
      padding: 10px; 
      text-align: left; 
    }
    th { 
      background-color: #f5f5f5; 
      font-weight: 600; 
    }
    pre { 
      background: #f5f5f5; 
      padding: 16px; 
      border-radius: 4px; 
      overflow-x: auto;
      font-size: 12px;
    }
    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>
  <div class="cover">
    <h1>${draft.meta.title}</h1>
    <div class="meta">
      <p>Prepared for ${draft.meta.clientName}</p>
      <p>${new Date(draft.meta.createdAt).toLocaleDateString()}</p>
    </div>
  </div>
  
  <div class="content">
    ${markdownToHTML(draft.markdown)}
  </div>
  
  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

function markdownToHTML(markdown: string): string {
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

  html = html.replace(/(<li>.*<\/li>)+/gs, "<ul>$&</ul>");

  return `<p>${html}</p>`;
}

