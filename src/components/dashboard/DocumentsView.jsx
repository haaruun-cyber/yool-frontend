import { useMemo, useEffect, useState, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { documentApi, searchApi } from '../../services/documentApi';
import { useAuthStore } from '../../store/authStore';
import { useDocumentStore } from '../../store/documentStore';
import { docOrderKey } from '../../utils/constants';
import { DOCUMENT_TYPES } from '../../utils/constants';
import { DocumentCard } from './DocumentCard';
import { SearchBar } from './SearchBar';
import { FilterDropdown } from './FilterDropdown';
import { Modal } from '../shared/Modal';
import { DocumentListSkeleton } from '../shared/Skeleton';
import { EmptyState } from '../shared/EmptyState';
import { handleApiLimitError, handleEmailVerificationError } from '../../utils/limitError';

function SortableItem({ doc }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: doc._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <DocumentCard doc={doc} style={undefined} dragHandleListeners={listeners} />
    </div>
  );
}

export function DocumentsView({ mode = null, showToolbar = true }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [orderTick, bumpOrder] = useReducer((x) => x + 1, 0);
  const user = useAuthStore((s) => s.user);
  const listFilter = useDocumentStore((s) => s.listFilter);
  const typeFilter = useDocumentStore((s) => s.typeFilter);
  const search = useDocumentStore((s) => s.search);
  const setListFilter = useDocumentStore((s) => s.setListFilter);
  const setTypeFilter = useDocumentStore((s) => s.setTypeFilter);
  const setSearch = useDocumentStore((s) => s.setSearch);

  useEffect(() => {
    if (mode === 'favorites') {
      setListFilter('favorites');
      setTypeFilter('');
    } else if (mode === 'shared') {
      setListFilter('shared');
      setTypeFilter('');
    } else if (mode === 'private') {
      setListFilter('private');
      setTypeFilter('');
    }
  }, [mode, setListFilter, setTypeFilter]);

  const { data, isLoading } = useQuery({
    queryKey: ['documents', 'active'],
    queryFn: async () => (await documentApi.list({ archived: 'false' })).data,
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('Untitled');
  const [newType, setNewType] = useState('note');

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const filtered = useMemo(() => {
    let rows = data || [];
    const lf = mode === 'favorites' ? 'favorites' : mode === 'shared' ? 'shared' : mode === 'private' ? 'private' : listFilter;
    const tf = typeFilter;
    const uid = user?.id;

    if (lf === 'favorites') rows = rows.filter((d) => d.isFavorite);
    if (lf === 'private') rows = rows.filter((d) => d.isPrivate && String(d.ownerId) === String(uid));
    if (lf === 'shared')
      rows = rows.filter(
        (d) =>
          String(d.ownerId) !== String(uid) &&
          (d.sharedUsers || []).some((s) => String(s.user) === String(uid))
      );
    if (tf) rows = rows.filter((d) => d.type === tf);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((d) => d.title?.toLowerCase().includes(q) || JSON.stringify(d.tags || []).toLowerCase().includes(q));
    }
    return rows;
  }, [data, listFilter, typeFilter, search, user, mode]);

  const orderedIds = useMemo(() => {
    const key = docOrderKey(user?.id);
    let order = [];
    try {
      order = JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      order = [];
    }
    const ids = filtered.map((d) => d._id);
    const merged = [...new Set([...order.filter((id) => ids.includes(id)), ...ids])];
    return merged;
  }, [filtered, user?.id, orderTick]);

  const orderedDocs = useMemo(
    () => orderedIds.map((id) => filtered.find((d) => d._id === id)).filter(Boolean),
    [orderedIds, filtered]
  );

  const persistOrder = (ids) => {
    localStorage.setItem(docOrderKey(user?.id), JSON.stringify(ids));
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = orderedIds.indexOf(active.id);
    const newIndex = orderedIds.indexOf(over.id);
    const next = arrayMove(orderedIds, oldIndex, newIndex);
    persistOrder(next);
    bumpOrder();
  };

  const create = useMutation({
    mutationFn: () => documentApi.create({ title: newTitle, type: newType, isPrivate: true, content: '' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents'] });
      setCreateOpen(false);
    },
    onError: (err) => {
      if (!handleEmailVerificationError(err, navigate)) {
        /* optional: show toast */
      }
    },
  });

  return (
    <div className="space-y-6">
      {showToolbar && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SearchBar
            onSubmit={async (q) => {
              if (!q.trim()) return;
              try {
                const res = await searchApi.search(q);
                setSearch('');
                qc.setQueryData(['documents', 'active'], res.data);
              } catch {
                /* keep client filter */
              }
            }}
          />
          <div className="flex flex-wrap items-center gap-2">
            <FilterDropdown />
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              New document
            </motion.button>
          </div>
        </div>
      )}

      {isLoading && <DocumentListSkeleton />}

      {!isLoading && !orderedDocs.length && (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Create your first workspace page — notes, planners, journals, and more."
          action={
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              New document
            </button>
          }
        />
      )}

      {!isLoading && orderedDocs.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={orderedIds} strategy={rectSortingStrategy}>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {orderedDocs.map((doc) => (
                <SortableItem key={doc._id} doc={doc} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create document">
        <label className="block text-sm font-medium text-ink-muted">
          Title
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200/80 bg-surface-muted/40 px-3 py-2 text-sm dark:border-slate-800"
          />
        </label>
        <label className="mt-3 block text-sm font-medium text-ink-muted">
          Type
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200/80 bg-surface-muted/40 px-3 py-2 text-sm dark:border-slate-800"
          >
            {DOCUMENT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="rounded-xl px-3 py-2 text-sm text-ink-muted hover:bg-surface-muted" onClick={() => setCreateOpen(false)}>
            Cancel
          </button>
          <button
            type="button"
            disabled={create.isPending}
            onClick={() => create.mutate()}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Create
          </button>
        </div>
      </Modal>
    </div>
  );
}
