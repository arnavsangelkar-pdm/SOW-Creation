import { Workspace, DocumentDraft, Version, Comment, Change } from "./schema";

const STORAGE_KEY = "sow_workspace";

export function saveWorkspace(workspace: Workspace): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
    } catch (e) {
      console.error("Failed to save workspace:", e);
    }
  }
}

export function loadWorkspace(): Workspace | null {
  if (typeof window !== "undefined") {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data) as Workspace;
      }
    } catch (e) {
      console.error("Failed to load workspace:", e);
    }
  }
  return null;
}

export function clearWorkspace(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function createVersion(
  draft: DocumentDraft,
  description: string
): Version {
  return {
    id: `v-${Date.now()}`,
    timestamp: new Date().toISOString(),
    description,
    draft,
  };
}

export function generateId(prefix: string = "item"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

