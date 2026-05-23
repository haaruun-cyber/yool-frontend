import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { DOCUMENT_TYPES } from '../../utils/constants';
import { useDocumentStore } from '../../store/documentStore';

export function FilterDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const listFilter = useDocumentStore((s) => s.listFilter);
  const typeFilter = useDocumentStore((s) => s.typeFilter);
  const setListFilter = useDocumentStore((s) => s.setListFilter);
  const setTypeFilter = useDocumentStore((s) => s.setTypeFilter);

  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const label =
    listFilter === 'favorites'
      ? 'Favorites'
      : listFilter === 'shared'
        ? 'Shared with me'
        : listFilter === 'private'
          ? 'Private'
          : typeFilter
            ? DOCUMENT_TYPES.find((d) => d.id === typeFilter)?.label || 'Type'
            : 'All documents';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-surface px-3 py-2 text-sm font-medium text-ink shadow-sm hover:border-slate-300 dark:border-slate-800"
      >
        {label}
        <ChevronDown className="h-4 w-4 text-ink-muted" />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-slate-200/80 bg-surface py-1 shadow-xl dark:border-slate-800">
          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-sm hover:bg-surface-muted"
            onClick={() => {
              setListFilter('all');
              setTypeFilter('');
              setOpen(false);
            }}
          >
            All documents
          </button>
          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-sm hover:bg-surface-muted"
            onClick={() => {
              setListFilter('favorites');
              setTypeFilter('');
              setOpen(false);
            }}
          >
            Favorites
          </button>
          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-sm hover:bg-surface-muted"
            onClick={() => {
              setListFilter('shared');
              setTypeFilter('');
              setOpen(false);
            }}
          >
            Shared
          </button>
          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-sm hover:bg-surface-muted"
            onClick={() => {
              setListFilter('private');
              setTypeFilter('');
              setOpen(false);
            }}
          >
            Private
          </button>
          <div className="my-1 border-t border-slate-200/80 dark:border-slate-800" />
          {DOCUMENT_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              className="block w-full px-3 py-2 text-left text-sm hover:bg-surface-muted"
              onClick={() => {
                setListFilter('all');
                setTypeFilter(t.id);
                setOpen(false);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
