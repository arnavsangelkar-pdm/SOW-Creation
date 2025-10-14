"use client";

import { Milestone } from "@/lib/schema";

interface TimelineProps {
  milestones: Milestone[];
}

export function Timeline({ milestones }: TimelineProps) {
  if (!milestones || milestones.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">No milestones defined</div>
    );
  }

  const maxWeek = Math.max(...milestones.map((m) => m.endWeek));

  return (
    <div className="space-y-6">
      {/* Week headers */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="w-32 shrink-0">Milestone</div>
        <div className="flex-1 flex gap-1">
          {Array.from({ length: maxWeek }, (_, i) => (
            <div
              key={i}
              className="flex-1 text-center font-medium"
              style={{ minWidth: "40px" }}
            >
              W{i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline bars */}
      <div className="space-y-3">
        {milestones.map((milestone) => {
          const duration = milestone.endWeek - milestone.startWeek + 1;
          const offset = milestone.startWeek - 1;

          return (
            <div key={milestone.id} className="flex items-center gap-2">
              <div className="w-32 shrink-0 text-sm font-medium truncate">
                {milestone.title}
              </div>
              <div className="flex-1 flex gap-1 relative h-10">
                {Array.from({ length: maxWeek }, (_, i) => (
                  <div
                    key={i}
                    className="flex-1 border-l border-border"
                    style={{ minWidth: "40px" }}
                  />
                ))}
                <div
                  className="absolute h-8 bg-primary/80 rounded-full flex items-center justify-center text-xs text-primary-foreground font-medium px-3"
                  style={{
                    left: `${(offset / maxWeek) * 100}%`,
                    width: `${(duration / maxWeek) * 100}%`,
                  }}
                >
                  {milestone.title.length > 20
                    ? milestone.title.slice(0, 17) + "..."
                    : milestone.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

