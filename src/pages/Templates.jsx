import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { templateApi } from '../services/templateApi';
import { TemplateCard } from '../components/templates/TemplateCard';
import { TEMPLATE_CATEGORIES } from '../utils/constants';
import { DocumentListSkeleton } from '../components/shared/Skeleton';
import { useUiStore } from '../store/uiStore';
import { handleApiLimitError, handleEmailVerificationError } from '../utils/limitError';

export default function Templates() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const openLimitModal = useUiStore((s) => s.openLimitModal);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => (await templateApi.list()).data,
  });

  const useTpl = useMutation({
    mutationFn: (id) => templateApi.use(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['documents'] });
      navigate(`/app/doc/${res.data._id}`);
    },
    onError: (err) => {
      if (!handleEmailVerificationError(err, navigate)) handleApiLimitError(err, openLimitModal);
    },
  });

  const filtered = useMemo(() => {
    let rows = data || [];
    if (q.trim()) {
      const s = q.toLowerCase();
      rows = rows.filter((t) => t.title.toLowerCase().includes(s) || t.category?.toLowerCase().includes(s));
    }
    if (cat !== 'all') {
      const m = TEMPLATE_CATEGORIES.find((c) => c.id === cat);
      if (m) rows = rows.filter((t) => m.match.includes(t.category));
    }
    return rows;
  }, [data, q, cat]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Template library</h1>
        <p className="text-sm text-ink-muted">Start faster with curated layouts for students and teams.</p>
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search templates…"
            className="w-full rounded-xl border border-slate-200/80 bg-surface-muted/40 py-2.5 pl-10 pr-3 text-sm dark:border-slate-800"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCat('all')}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              cat === 'all' ? 'bg-indigo-600 text-white' : 'bg-surface-muted text-ink-muted'
            }`}
          >
            All
          </button>
          {TEMPLATE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                cat === c.id ? 'bg-indigo-600 text-white' : 'bg-surface-muted text-ink-muted'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      {isLoading && <DocumentListSkeleton />}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <TemplateCard
            key={t._id}
            template={t}
            onUse={() => useTpl.mutate(t._id)}
            onDuplicate={() => useTpl.mutate(t._id)}
          />
        ))}
      </div>
    </div>
  );
}
