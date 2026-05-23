import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  panelOpen: false,
  setPanelOpen: (panelOpen) => set({ panelOpen }),
}));
