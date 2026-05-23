import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUiStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      searchOpen: false,
      hideCollabCard: false,
      aiPanelOpen: false,
      limitModal: { open: false, type: null, message: '', used: null, limit: null },
      checkoutPlan: null,
      setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set({ theme });
      },
      initTheme: () => {
        const t = useUiStore.getState().theme;
        document.documentElement.classList.toggle('dark', t === 'dark');
      },
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setMobileSidebarOpen: (mobileSidebarOpen) => set({ mobileSidebarOpen }),
      setSearchOpen: (searchOpen) => set({ searchOpen }),
      setHideCollabCard: (hideCollabCard) => set({ hideCollabCard }),
      setAiPanelOpen: (aiPanelOpen) => set({ aiPanelOpen }),
      openLimitModal: (payload) =>
        set({
          limitModal: {
            open: true,
            type: payload.type || 'generic',
            message: payload.message || '',
            used: payload.used ?? null,
            limit: payload.limit ?? null,
          },
        }),
      closeLimitModal: () =>
        set({
          limitModal: { open: false, type: null, message: '', used: null, limit: null },
        }),
      setCheckoutPlan: (checkoutPlan) => set({ checkoutPlan }),
      clearCheckoutPlan: () => set({ checkoutPlan: null }),
    }),
    { name: 'yool-ui' }
  )
);
