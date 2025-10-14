"use client";

import { Section } from "@/lib/schema";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamically import markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface EditorPaneProps {
  section: Section;
  onUpdate: (content: any) => void;
  readOnly?: boolean;
}

export function EditorPane({ section, onUpdate, readOnly = false }: EditorPaneProps) {
  const [value, setValue] = useState<string>(
    typeof section.content === "string"
      ? section.content
      : Array.isArray(section.content)
      ? section.content.join("\n")
      : JSON.stringify(section.content, null, 2)
  );

  const handleChange = (newValue?: string) => {
    if (newValue === undefined) return;
    setValue(newValue);
    
    // Parse based on section kind
    if (section.kind === "bullets") {
      onUpdate(newValue.split("\n").filter((l) => l.trim()));
    } else if (section.kind === "text") {
      onUpdate(newValue);
    } else {
      onUpdate(newValue);
    }
  };

  if (section.kind === "text") {
    return (
      <div className="space-y-4" data-color-mode="light">
        <div>
          <Label className="text-lg font-semibold">{section.title}</Label>
        </div>
        <MDEditor
          value={value}
          onChange={handleChange}
          preview="edit"
          hideToolbar={readOnly}
          height={400}
        />
      </div>
    );
  }

  if (section.kind === "bullets") {
    return (
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">{section.title}</Label>
          <p className="text-sm text-muted-foreground mt-1">
            One item per line
          </p>
        </div>
        <Textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          rows={12}
          className="font-mono text-sm"
          readOnly={readOnly}
        />
      </div>
    );
  }

  if (section.kind === "table" || section.kind === "timeline") {
    return (
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">{section.title}</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Structured data (JSON format)
          </p>
        </div>
        <Textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          rows={20}
          className="font-mono text-sm"
          readOnly={readOnly}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold">{section.title}</Label>
      <div className="text-muted-foreground">Unknown section type</div>
    </div>
  );
}

