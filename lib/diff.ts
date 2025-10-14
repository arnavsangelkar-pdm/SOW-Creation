export interface DiffResult {
  added: string[];
  removed: string[];
  unchanged: string[];
}

export function simpleDiff(before: string, after: string): DiffResult {
  const beforeLines = before.split("\n");
  const afterLines = after.split("\n");

  const added: string[] = [];
  const removed: string[] = [];
  const unchanged: string[] = [];

  let i = 0;
  let j = 0;

  while (i < beforeLines.length || j < afterLines.length) {
    if (i >= beforeLines.length) {
      added.push(afterLines[j]);
      j++;
    } else if (j >= afterLines.length) {
      removed.push(beforeLines[i]);
      i++;
    } else if (beforeLines[i] === afterLines[j]) {
      unchanged.push(beforeLines[i]);
      i++;
      j++;
    } else {
      // Simple heuristic: check if next lines match
      if (beforeLines[i + 1] === afterLines[j]) {
        removed.push(beforeLines[i]);
        i++;
      } else if (beforeLines[i] === afterLines[j + 1]) {
        added.push(afterLines[j]);
        j++;
      } else {
        removed.push(beforeLines[i]);
        added.push(afterLines[j]);
        i++;
        j++;
      }
    }
  }

  return { added, removed, unchanged };
}

export function formatDiff(diff: DiffResult): string {
  const lines: string[] = [];

  for (const line of diff.removed) {
    lines.push(`- ${line}`);
  }

  for (const line of diff.added) {
    lines.push(`+ ${line}`);
  }

  for (const line of diff.unchanged) {
    lines.push(`  ${line}`);
  }

  return lines.join("\n");
}

