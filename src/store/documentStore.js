import { create } from 'zustand';

export const useDocumentStore = create((set) => ({
  listFilter: 'all',
  search: '',
  typeFilter: '',
  setListFilter: (listFilter) => set({ listFilter }),
  setSearch: (search) => set({ search }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  resetFilters: () => set({ listFilter: 'all', search: '', typeFilter: '' }),
}));
