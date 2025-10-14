"use client";

import { Version } from "@/lib/schema";
import { formatDateTime } from "@/lib/utils";
import { Button } from "./ui/button";
import { History, Eye } from "lucide-react";

interface VersionListProps {
  versions: Version[];
  onRestore?: (versionId: string) => void;
}

export function VersionList({ versions, onRestore }: VersionListProps) {
  if (versions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No version history yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {versions.map((version) => (
        <div
          key={version.id}
          className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <History className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">{version.description}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDateTime(version.timestamp)}
              </div>
            </div>
            {onRestore && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRestore(version.id)}
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

