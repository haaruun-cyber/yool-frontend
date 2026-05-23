import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchApi } from '../../services/documentApi';
import { useUiStore } from '../../store/uiStore';
import { DocumentTypeIcon } from '../../utils/docIcons';

export function SearchModal() {
  const navigate = useNavigate();
  const open = useUiStore((s) => s.searchOpen);
  const setSearchOpen = useUiStore((s) => s.setSearchOpen);
  const [q, setQ] = useState('');

  const { data, isFetching } = useQuery({
    queryKey: ['search', q],
    queryFn: async () => (await searchApi.search(q.trim(), { limit: 12 })).data,
    enabled: open && q.trim().length >= 2,
  });

  useEffect(() => {
    if (!open) setQ('');
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setSearchOpen]);

  const go = (id) => {
    setSearchOpen(false);
    navigate(`/app/doc/${id}`);
  };

  const results = Array.isArray(data) ? data : data?.results || data?.documents || [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-start justify-center bg-black/60 px-4 pt-[12vh]"
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            className="w-full max-w-xl overflow-hidden rounded-xl border border-notion-border bg-[rgb(var(--surface-elevated))] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div className="flex items-center gap-2 border-b border-notion-border px-3 py-2">
              <Search className="h-4 w-4 text-ink-muted" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search pages…"
                className="flex-1 bg-transparent py-2 text-sm outline-none"
              />
              <kbd className="hidden rounded border border-notion-border px-1.5 py-0.5 text-[10px] text-ink-muted sm:inline">
                esc
              </kbd>
            </motion.div>
            <div className="max-h-80 overflow-y-auto p-2">
              {q.trim().length < 2 && (
                <p className="px-2 py-6 text-center text-sm text-ink-muted">Type at least 2 characters to search</p>
              )}
              {q.trim().length >= 2 && isFetching && (
                <p className="px-2 py-4 text-sm text-ink-muted">Searching…</p>
              )}
              {q.trim().length >= 2 && !isFetching && !results.length && (
                <p className="px-2 py-4 text-sm text-ink-muted">No results</p>
              )}
              {Array.isArray(results) &&
                results.map((doc) => (
                  <button
                    key={doc._id}
                    type="button"
                    onClick={() => go(doc._id)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-notion-hover"
                  >
                    <DocumentTypeIcon type={doc.type} className="h-4 w-4 shrink-0 text-ink-muted" />
                    <span className="truncate font-medium">{doc.title || 'Untitled'}</span>
                  </button>
                ))}
            </div>
            <motion.div className="border-t border-notion-border px-3 py-2 text-[11px] text-ink-muted">
              <FileText className="mr-1 inline h-3 w-3" />
              Ctrl+K to open search anywhere
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
