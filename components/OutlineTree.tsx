"use client";

import { Section } from "@/lib/schema";
import { cn } from "@/lib/utils";
import {
  FileText,
  List,
  Table,
  Calendar,
  ChevronRight,
} from "lucide-react";

interface OutlineTreeProps {
  sections: Section[];
  activeSectionId?: string;
  onSectionClick: (sectionId: string) => void;
}

export function OutlineTree({
  sections,
  activeSectionId,
  onSectionClick,
}: OutlineTreeProps) {
  const getIcon = (kind: Section["kind"]) => {
    switch (kind) {
      case "text":
        return FileText;
      case "bullets":
        return List;
      case "table":
        return Table;
      case "timeline":
        return Calendar;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-1">
      {sections.map((section) => {
        const Icon = getIcon(section.kind);
        const isActive = section.id === activeSectionId;

        return (
          <button
            key={section.id}
            onClick={() => onSectionClick(section.id)}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left truncate">{section.title}</span>
            {isActive && <ChevronRight className="h-4 w-4 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

