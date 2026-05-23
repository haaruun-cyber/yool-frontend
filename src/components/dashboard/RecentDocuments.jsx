import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { DocumentTypeIcon } from '../../utils/docIcons';

export function RecentDocuments({ documents }) {
  const navigate = useNavigate();
  const recent = [...(documents || [])]
    .sort((a, b) => new Date(b.updatedAt || b.lastEdited || 0) - new Date(a.updatedAt || a.lastEdited || 0))
    .slice(0, 5);

  if (!recent.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-surface-muted/30 p-4 dark:border-slate-800">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
        <Clock className="h-4 w-4 text-ink-muted" />
        Recent
      </div>
      <ul className="space-y-1">
        {recent.map((d) => (
          <li key={d._id}>
            <button
              type="button"
              onClick={() => navigate(`/app/doc/${d._id}`)}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm hover:bg-surface"
            >
              <DocumentTypeIcon type={d.type} className="h-4 w-4 text-indigo-500" />
              <span className="flex-1 truncate font-medium text-ink">{d.title}</span>
              <span className="text-xs text-ink-muted">
                {formatDistanceToNow(new Date(d.updatedAt || d.lastEdited || d.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
