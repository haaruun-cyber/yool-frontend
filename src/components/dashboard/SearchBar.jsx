import { Search } from 'lucide-react';
import { useDocumentStore } from '../../store/documentStore';

export function SearchBar({ onSubmit }) {
  const search = useDocumentStore((s) => s.search);
  const setSearch = useDocumentStore((s) => s.setSearch);

  return (
    <form
      className="relative w-full max-w-xl"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(search);
      }}
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search documents…"
        className="w-full rounded-xl border border-slate-200/80 bg-surface-muted/40 py-2.5 pl-10 pr-4 text-sm text-ink outline-none ring-indigo-500/30 placeholder:text-ink-muted focus:border-indigo-400 focus:ring-2 dark:border-slate-800"
      />
    </form>
  );
}
