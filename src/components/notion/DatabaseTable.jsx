import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, List, SlidersHorizontal, ArrowUpDown, Search } from 'lucide-react';
import { documentApi } from '../../services/documentApi';
import { userApi } from '../../services/authApi';
import { useAuthStore } from '../../store/authStore';
import { useDocumentStore } from '../../store/documentStore';
import { useUiStore } from '../../store/uiStore';
import { DocumentTypeIcon } from '../../utils/docIcons';
import { StatusPill } from './StatusPill';
import { Modal } from '../shared/Modal';
import { DOCUMENT_TYPES } from '../../utils/constants';
import { getDefaultContent } from '../../utils/templateContent';
import { handleApiLimitError, handleEmailVerificationError } from '../../utils/limitError';

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=280&fit=crop';

export function DatabaseTable({ mode = null, pageTitle = 'Project Planner', pageDescription }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const search = useDocumentStore((s) => s.search);
  const setSearch = useDocumentStore((s) => s.setSearch);
  const openLimitModal = useUiStore((s) => s.openLimitModal);

  const [sortBy, setSortBy] = useState('updated');
  const [statusFilter, setStatusFilter] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('Untitled');
  const [newType, setNewType] = useState('project_planner');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const { data: usage } = useQuery({
    queryKey: ['usage'],
    queryFn: async () => (await userApi.usage()).data,
    staleTime: 30_000,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['documents', 'active'],
    queryFn: async () => (await documentApi.list({ archived: 'false' })).data,
  });

  const filtered = useMemo(() => {
    let rows = data || [];
    const uid = user?.id;
    if (mode === 'favorites') rows = rows.filter((d) => d.isFavorite);
    if (mode === 'private') rows = rows.filter((d) => d.isPrivate && String(d.ownerId) === String(uid));
    if (mode === 'shared')
      rows = rows.filter(
        (d) =>
          String(d.ownerId) !== String(uid) &&
          (d.sharedUsers || []).some((s) => String(s.user) === String(uid))
      );
    if (statusFilter) rows = rows.filter((d) => (d.status || 'not_started') === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((d) => d.title?.toLowerCase().includes(q));
    }
    const sorted = [...rows];
    if (sortBy === 'title') sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    else if (sortBy === 'status') sorted.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
    else if (sortBy === 'deadline')
      sorted.sort((a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0));
    else sorted.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
    return sorted;
  }, [data, mode, search, statusFilter, sortBy, user?.id]);

  const patchDoc = useMutation({
    mutationFn: ({ id, payload }) => documentApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }),
  });

  const create = useMutation({
    mutationFn: () =>
      documentApi.create({
        title: newTitle,
        type: newType,
        isPrivate: true,
        status: 'not_started',
        content: getDefaultContent(newType),
      }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['documents', 'active'] });
      qc.invalidateQueries({ queryKey: ['usage'] });
      setCreateOpen(false);
      navigate(`/app/doc/${res.data._id}`);
    },
    onError: (err) => {
      if (!handleEmailVerificationError(err, navigate)) handleApiLimitError(err, openLimitModal);
    },
  });

  const tryCreate = () => {
    if (usage?.documents?.limit != null && usage.documents.used >= usage.documents.limit) {
      openLimitModal({
        type: 'documents',
        message: `Free plan allows ${usage.documents.limit} active documents.`,
        used: usage.documents.used,
        limit: usage.documents.limit,
      });
      return;
    }
    setCreateOpen(true);
  };

  return (
    <div className="flex min-h-full flex-col">
      <div className="relative -mx-4 mb-0 md:-mx-8">
        <img src={DEFAULT_COVER} alt="" className="h-32 w-full object-cover md:h-44" />
      </div>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 pb-16 pt-6 md:px-12">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-2xl">📋</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-ink">{pageTitle}</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          {pageDescription ||
            'Use this table to track projects. Add a row for each project, set status and deadline, then open a row to edit details.'}
        </p>

        {usage?.plan === 'free' && usage.documents?.limit != null && (
          <p className="mt-3 text-xs text-ink-muted">
            {usage.documents.used} / {usage.documents.limit} documents on Free plan
            {usage.documents.used >= usage.documents.limit && (
              <button
                type="button"
                className="ml-2 text-indigo-400 hover:underline"
                onClick={() =>
                  openLimitModal({
                    type: 'documents',
                    used: usage.documents.used,
                    limit: usage.documents.limit,
                  })
                }
              >
                Upgrade
              </button>
            )}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-notion-border pb-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-notion-hover px-2 py-1 text-sm font-medium text-ink"
          >
            <List className="h-4 w-4" />
            Table
          </button>
          <button type="button" className="rounded-md p-1.5 text-ink-muted hover:bg-notion-hover" title="Filter">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border-0 bg-transparent py-1 text-sm text-ink-muted hover:bg-notion-hover"
          >
            <option value="">All statuses</option>
            <option value="not_started">Not started</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
          <button
            type="button"
            onClick={() => setSortBy(sortBy === 'title' ? 'updated' : 'title')}
            className="rounded-md p-1.5 text-ink-muted hover:bg-notion-hover"
            title="Sort"
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>
          <div className="relative ml-auto flex items-center gap-2">
            <Search className="pointer-events-none absolute left-2 h-4 w-4 text-ink-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-40 rounded-md border-0 bg-notion-hover py-1.5 pl-8 pr-2 text-sm outline-none md:w-52"
            />
            <button
              type="button"
              onClick={tryCreate}
              className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              New ▾
            </button>
          </div>
        </div>

        <div className="mt-0 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-notion-border text-left text-xs text-ink-muted">
                <th className="w-36 py-2 pr-3 font-normal">Status</th>
                <th className="py-2 pr-3 font-normal">Project</th>
                <th className="w-40 py-2 font-normal">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-notion-border">
                    <td colSpan={3} className="py-3">
                      <div className="h-4 animate-pulse rounded bg-notion-hover" />
                    </td>
                  </tr>
                ))}
              {!isLoading &&
                filtered.map((doc) => (
                  <tr key={doc._id} className="group border-b border-notion-border hover:bg-notion-hover/60">
                    <td className="py-1.5 pr-3 align-middle">
                      <StatusPill
                        value={doc.status || 'not_started'}
                        onChange={(status) => patchDoc.mutate({ id: doc._id, payload: { status } })}
                      />
                    </td>
                    <td className="py-1.5 pr-3 align-middle">
                      {editingId === doc._id ? (
                        <input
                          autoFocus
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={() => {
                            const t = editingTitle.trim() || 'Untitled';
                            patchDoc.mutate({ id: doc._id, payload: { title: t } });
                            setEditingId(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') e.target.blur();
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          className="w-full rounded bg-notion-hover px-2 py-1 text-sm font-medium outline-none"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => navigate(`/app/doc/${doc._id}`)}
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            setEditingId(doc._id);
                            setEditingTitle(doc.title || '');
                          }}
                          className="flex w-full items-center gap-2 rounded px-1 py-1 text-left hover:bg-notion-hover"
                        >
                          <DocumentTypeIcon type={doc.type} className="h-4 w-4 shrink-0 text-ink-muted" />
                          <span className="truncate font-medium text-ink">{doc.title || 'Untitled'}</span>
                        </button>
                      )}
                    </td>
                    <td className="py-1.5 align-middle">
                      <input
                        type="date"
                        value={doc.deadline ? new Date(doc.deadline).toISOString().slice(0, 10) : ''}
                        onChange={(e) => {
                          const deadline = e.target.value ? new Date(e.target.value).toISOString() : null;
                          patchDoc.mutate({ id: doc._id, payload: { deadline } });
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full rounded border-0 bg-transparent px-1 py-1 text-ink-muted hover:bg-notion-hover focus:bg-notion-hover"
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={tryCreate}
            className="mt-1 flex w-full items-center gap-2 rounded px-2 py-2 text-sm text-ink-muted hover:bg-notion-hover"
          >
            <Plus className="h-4 w-4" />
            New page
          </button>
        </div>
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New page">
        <label className="block text-sm font-medium text-ink-muted">
          Title
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-notion-border bg-notion-hover px-3 py-2 text-sm"
          />
        </label>
        <label className="mt-3 block text-sm font-medium text-ink-muted">
          Type
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="mt-1 w-full rounded-lg border border-notion-border bg-notion-hover px-3 py-2 text-sm"
          >
            {DOCUMENT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="rounded-lg px-3 py-2 text-sm text-ink-muted" onClick={() => setCreateOpen(false)}>
            Cancel
          </button>
          <button
            type="button"
            disabled={create.isPending}
            onClick={() => create.mutate()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Create
          </button>
        </div>
      </Modal>
    </div>
  );
}
