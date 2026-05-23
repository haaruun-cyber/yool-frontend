import { create } from 'zustand';

export const useTaskStore = create((set) => ({
  draftByDoc: {},
  setDraft: (docId, tasks) =>
    set((s) => ({
      draftByDoc: { ...s.draftByDoc, [docId]: tasks },
    })),
  clearDraft: (docId) =>
    set((s) => {
      const next = { ...s.draftByDoc };
      delete next[docId];
      return { draftByDoc: next };
    }),
}));
