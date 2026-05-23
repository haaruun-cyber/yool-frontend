import { Plus } from 'lucide-react';
import { uid } from '../../../utils/templateContent';
import { StatusPill } from '../../notion/StatusPill';
import { DbToolbar } from '../DbToolbar';

export function ProjectPlannerView({ content, onChange }) {
  const rows = content.rows || [];

  const setRows = (next) => onChange({ ...content, rows: next });

  const addRow = () => {
    setRows([...rows, { id: uid(), title: 'Untitled', status: 'not_started', deadline: null }]);
  };

  return (
    <div>
      <DbToolbar title="Table" onNew={addRow} newLabel="New" />
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-notion-border text-left text-xs text-ink-muted">
            <th className="w-36 py-2 font-normal">Status</th>
            <th className="py-2 font-normal">Project</th>
            <th className="w-40 py-2 font-normal">Deadline</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-notion-border hover:bg-notion-hover/50">
              <td className="py-1.5 pr-3">
                <StatusPill
                  value={row.status || 'not_started'}
                  onChange={(status) =>
                    setRows(rows.map((r) => (r.id === row.id ? { ...r, status } : r)))
                  }
                />
              </td>
              <td className="py-1.5 pr-3">
                <input
                  value={row.title}
                  onChange={(e) =>
                    setRows(rows.map((r) => (r.id === row.id ? { ...r, title: e.target.value } : r)))
                  }
                  className="w-full bg-transparent font-medium outline-none"
                />
              </td>
              <td className="py-1.5">
                <input
                  type="date"
                  value={row.deadline ? new Date(row.deadline).toISOString().slice(0, 10) : ''}
                  onChange={(e) =>
                    setRows(
                      rows.map((r) =>
                        r.id === row.id
                          ? { ...r, deadline: e.target.value ? new Date(e.target.value).toISOString() : null }
                          : r
                      )
                    )
                  }
                  className="w-full bg-transparent text-ink-muted outline-none"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={addRow}
        className="mt-1 flex items-center gap-2 px-2 py-2 text-sm text-ink-muted hover:bg-notion-hover"
      >
        <Plus className="h-4 w-4" /> New page
      </button>
    </div>
  );
}
