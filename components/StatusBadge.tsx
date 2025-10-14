"use client";

import { DocumentDraft } from "@/lib/schema";
import { Badge } from "./ui/badge";

interface StatusBadgeProps {
  status: DocumentDraft["status"];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant =
    status === "Draft"
      ? "secondary"
      : status === "In Review"
      ? "default"
      : "outline";

  return (
    <Badge variant={variant} className="font-medium">
      {status}
    </Badge>
  );
}

