import { Plus } from 'lucide-react';
import { uid } from '../../../utils/templateContent';
import { DbToolbar } from '../DbToolbar';

const COLS = [
  { key: 'not_started', label: 'Not started' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'done', label: 'Done' },
];

export function HabitTrackerView({ content, onChange }) {
  const columns = content.columns || { not_started: [], in_progress: [], done: [] };

  const setCol = (key, items) => onChange({ ...content, columns: { ...columns, [key]: items } });

  const addCard = (key) => {
    setCol(key, [...(columns[key] || []), { id: uid(), title: 'New habit' }]);
  };

  const updateTitle = (key, id, title) => {
    setCol(
      key,
      (columns[key] || []).map((c) => (c.id === id ? { ...c, title } : c))
    );
  };

  const moveCard = (from, to, id) => {
    const card = (columns[from] || []).find((c) => c.id === id);
    if (!card) return;
    setCol(
      from,
      (columns[from] || []).filter((c) => c.id !== id)
    );
    setCol(to, [...(columns[to] || []), card]);
  };

  return (
    <div>
      <p className="mb-4 text-sm text-ink-muted">
        Track habits on a board. Use the status menu on each card to move it between columns.
      </p>
      <div className="mb-3 flex gap-2">
        <span className="rounded-md bg-notion-hover px-2 py-1 text-sm font-medium">Cards</span>
        <span className="rounded-md px-2 py-1 text-sm text-ink-muted">Table</span>
      </div>
      <DbToolbar title="" onNew={null} />
      <div className="flex gap-3 overflow-x-auto pb-4">
        {COLS.map(({ key, label }) => (
          <div key={key} className="w-64 shrink-0 rounded-lg bg-notion-hover/40 p-2">
            <div className="mb-2 flex items-center justify-between px-1 text-sm text-ink-muted">
              <span>{label}</span>
              <span>{(columns[key] || []).length}</span>
            </div>
            <div className="space-y-2">
              {(columns[key] || []).map((card) => (
                <div key={card.id} className="rounded-md border border-notion-border bg-surface px-3 py-2 shadow-sm">
                  <input
                    value={card.title}
                    onChange={(e) => updateTitle(key, card.id, e.target.value)}
                    className="mb-2 w-full bg-transparent text-sm font-medium outline-none"
                  />
                  <select
                    value={key}
                    onChange={(e) => moveCard(key, e.target.value, card.id)}
                    className="w-full rounded bg-notion-hover px-2 py-1 text-xs text-ink-muted"
                  >
                    {COLS.map((c) => (
                      <option key={c.key} value={c.key}>
                        Move to {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addCard(key)}
              className="mt-2 flex w-full items-center gap-1 rounded px-2 py-1.5 text-sm text-ink-muted hover:bg-notion-hover"
            >
              <Plus className="h-4 w-4" />
              New page
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
