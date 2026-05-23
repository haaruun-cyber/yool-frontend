import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { GripVertical, MoreHorizontal, Pin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DocumentTypeIcon } from '../../utils/docIcons';

export function DocumentCard({ doc, style, dragHandleListeners }) {
  const navigate = useNavigate();
  const updated = doc.updatedAt || doc.lastEdited || doc.createdAt;

  return (
    <motion.div
      layout
      style={style}
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/app/doc/${doc._id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/app/doc/${doc._id}`)}
      className="group relative flex cursor-pointer rounded-xl border border-slate-200/80 bg-surface p-4 shadow-card transition hover:border-indigo-300/60 hover:shadow-md dark:border-slate-800 dark:hover:border-indigo-500/40"
    >
      {doc.isPinned && (
        <Pin className="absolute right-3 top-3 h-4 w-4 text-amber-500" aria-hidden />
      )}
      {dragHandleListeners && (
        <button
          type="button"
          className="mr-2 mt-0.5 shrink-0 cursor-grab rounded-md p-1 text-ink-muted hover:bg-surface-muted active:cursor-grabbing"
          {...dragHandleListeners}
          onClick={(e) => e.stopPropagation()}
          aria-label="Reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-indigo-600 dark:text-indigo-300">
            <DocumentTypeIcon type={doc.type} className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-ink">{doc.title}</h3>
            <p className="text-xs capitalize text-ink-muted">
              {String(doc.type || 'note').replaceAll('_', ' ')}
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg p-1 text-ink-muted opacity-0 transition hover:bg-surface-muted group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
            aria-label="More"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-ink-muted">
          Edited{' '}
          {updated
            ? formatDistanceToNow(new Date(updated), { addSuffix: true })
            : 'recently'}
        </p>
      </div>
    </motion.div>
  );
}
