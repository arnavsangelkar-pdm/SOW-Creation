import { create } from "zustand";
import {
  DocumentDraft,
  Workspace,
  Version,
  Comment,
  Change,
} from "./schema";
import { saveWorkspace, loadWorkspace, createVersion, generateId } from "./storage";

interface WorkspaceState extends Workspace {
  // Actions
  setSow: (sow: DocumentDraft) => void;
  setProposal: (proposal: DocumentDraft) => void;
  updateSowSection: (sectionId: string, content: any) => void;
  updateProposalSection: (sectionId: string, content: any) => void;
  addVersion: (draft: DocumentDraft, description: string) => void;
  addComment: (comment: Omit<Comment, "id" | "timestamp">) => void;
  resolveComment: (commentId: string) => void;
  addChange: (change: Omit<Change, "id" | "timestamp">) => void;
  acceptChange: (changeId: string) => void;
  rejectChange: (changeId: string) => void;
  updateStatus: (docId: string, status: DocumentDraft["status"]) => void;
  loadFromStorage: () => void;
  reset: () => void;
}

const initialState: Workspace = {
  sow: undefined,
  proposal: undefined,
  versions: [],
  changes: [],
  comments: [],
};

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  ...initialState,

  setSow: (sow) => {
    set({ sow });
    saveWorkspace(get());
  },

  setProposal: (proposal) => {
    set({ proposal });
    saveWorkspace(get());
  },

  updateSowSection: (sectionId, content) => {
    const { sow } = get();
    if (!sow) return;

    const updatedSections = sow.sections.map((s) =>
      s.id === sectionId ? { ...s, content } : s
    );

    const updatedSow = { ...sow, sections: updatedSections };
    set({ sow: updatedSow });
    saveWorkspace(get());
  },

  updateProposalSection: (sectionId, content) => {
    const { proposal } = get();
    if (!proposal) return;

    const updatedSections = proposal.sections.map((s) =>
      s.id === sectionId ? { ...s, content } : s
    );

    const updatedProposal = { ...proposal, sections: updatedSections };
    set({ proposal: updatedProposal });
    saveWorkspace(get());
  },

  addVersion: (draft, description) => {
    const version = createVersion(draft, description);
    set((state) => ({
      versions: [...state.versions, version],
    }));
    saveWorkspace(get());
  },

  addComment: (comment) => {
    const newComment: Comment = {
      ...comment,
      id: generateId("comment"),
      timestamp: new Date().toISOString(),
      replies: comment.replies || [],
    };

    set((state) => ({
      comments: [...state.comments, newComment],
    }));
    saveWorkspace(get());
  },

  resolveComment: (commentId) => {
    set((state) => ({
      comments: state.comments.map((c) =>
        c.id === commentId ? { ...c, resolved: true } : c
      ),
    }));
    saveWorkspace(get());
  },

  addChange: (change) => {
    const newChange: Change = {
      ...change,
      id: generateId("change"),
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      changes: [...state.changes, newChange],
    }));
    saveWorkspace(get());
  },

  acceptChange: (changeId) => {
    const change = get().changes.find((c) => c.id === changeId);
    if (!change) return;

    // Apply the change
    get().updateSowSection(change.sectionId, change.after);

    set((state) => ({
      changes: state.changes.map((c) =>
        c.id === changeId ? { ...c, status: "accepted" as const } : c
      ),
    }));
    saveWorkspace(get());
  },

  rejectChange: (changeId) => {
    set((state) => ({
      changes: state.changes.map((c) =>
        c.id === changeId ? { ...c, status: "rejected" as const } : c
      ),
    }));
    saveWorkspace(get());
  },

  updateStatus: (docId, status) => {
    const { sow, proposal } = get();

    if (sow?.id === docId) {
      set({ sow: { ...sow, status } });
    }

    if (proposal?.id === docId) {
      set({ proposal: { ...proposal, status } });
    }

    saveWorkspace(get());
  },

  loadFromStorage: () => {
    const workspace = loadWorkspace();
    if (workspace) {
      set(workspace);
    }
  },

  reset: () => {
    set(initialState);
    saveWorkspace(initialState);
  },
}));

