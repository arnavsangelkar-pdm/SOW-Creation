"use client";

import { useEffect, useState } from "react";
import { DocumentDraft } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Download, Printer } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ReviewPage({ params }: { params: { id: string } }) {
  const [draft, setDraft] = useState<DocumentDraft | null>(null);

  useEffect(() => {
    // In a real app, fetch by ID
    // For demo, load from localStorage
    const workspace = localStorage.getItem("sow_workspace");
    if (workspace) {
      const data = JSON.parse(workspace);
      setDraft(data.sow);
    }
  }, [params.id]);

  const handlePrint = () => {
    window.print();
  };

  if (!draft) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Document Not Found</h2>
          <p className="text-muted-foreground">
            The requested document could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Print-hidden controls */}
      <header className="border-b bg-card px-6 py-4 print:hidden sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{draft.meta.title}</h1>
            <p className="text-sm text-muted-foreground">
              {draft.meta.clientName} • {formatDate(draft.meta.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={draft.status} />
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </header>

      {/* Print-optimized content */}
      <main className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Cover page */}
          <Card className="p-12 mb-8 text-center print:border-0">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                {draft.brand?.name || "Apex Consulting"}
              </div>
              <h1 className="text-4xl font-bold">{draft.meta.title}</h1>
              <div className="text-xl text-muted-foreground">
                Prepared for {draft.meta.clientName}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(draft.meta.createdAt)}
              </div>
            </div>
          </Card>

          {/* Markdown content */}
          <Card className="p-12 prose prose-slate max-w-none print:border-0">
            <div
              dangerouslySetInnerHTML={{
                __html: markdownToHTML(draft.markdown),
              }}
            />
          </Card>
        </div>
      </main>

      <style jsx global>{`
        @media print {
          header,
          .print\\:hidden {
            display: none !important;
          }
          
          body {
            background: white !important;
          }
          
          .prose {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

function markdownToHTML(markdown: string): string {
  // Basic markdown to HTML conversion
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mt-8 mb-4 border-b pb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-6">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^- (.*$)/gim, "<li>$1</li>")
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto"><code>$1</code></pre>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>");

  // Wrap list items
  html = html.replace(/(<li>.*<\/li>)+/gs, '<ul class="list-disc pl-6 space-y-2">$&</ul>');

  // Basic table detection (simplified)
  html = html.replace(/(\|.*\|[\s\S]*?)(?=<h|$)/g, (match) => {
    const lines = match.trim().split('\n');
    if (lines.length < 2) return match;
    
    let table = '<table class="w-full border-collapse my-4"><thead><tr>';
    const headers = lines[0].split('|').filter(h => h.trim());
    headers.forEach(h => {
      table += `<th class="border border-gray-300 px-4 py-2 bg-gray-50 text-left font-semibold">${h.trim()}</th>`;
    });
    table += '</tr></thead><tbody>';
    
    for (let i = 2; i < lines.length; i++) {
      if (!lines[i].includes('|')) continue;
      table += '<tr>';
      const cells = lines[i].split('|').filter(c => c.trim());
      cells.forEach(c => {
        table += `<td class="border border-gray-300 px-4 py-2">${c.trim()}</td>`;
      });
      table += '</tr>';
    }
    
    table += '</tbody></table>';
    return table;
  });

  return `<div class="space-y-4">${html}</div>`;
}

