import { Plus } from 'lucide-react';
import { DAYS, DAY_LABELS, uid } from '../../../utils/templateContent';
import { DbToolbar } from '../DbToolbar';

export function WeeklyTodoView({ content, onChange }) {
  const weekLabel = content.weekLabel || 'This week';
  const days = content.days || {};

  const setDays = (next) => onChange({ ...content, days: next });

  const addTodo = (day) => {
    const list = [...(days[day] || []), { id: uid(), text: 'To-do', done: false }];
    setDays({ ...days, [day]: list });
  };

  const updateTodo = (day, id, patch) => {
    setDays({
      ...days,
      [day]: (days[day] || []).map((t) => (t.id === id ? { ...t, ...patch } : t)),
    });
  };

  const newWeek = () => {
    const empty = DAYS.reduce((acc, d) => {
      acc[d] = [{ id: uid(), text: 'To-do', done: false }];
      return acc;
    }, {});
    onChange({ ...content, weekLabel: 'New week', days: empty });
  };

  return (
    <div>
      <p className="mb-4 text-sm text-ink-muted">
        Type tasks for each day. Check items off as you complete them.
      </p>
      <button
        type="button"
        onClick={newWeek}
        className="mb-6 rounded-md border border-notion-border px-3 py-1.5 text-sm hover:bg-notion-hover"
      >
        New week of blank to-do&apos;s
      </button>
      <DbToolbar title={weekLabel} onNew={null} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {DAYS.map((day) => (
          <div key={day} className="min-w-0">
            <div className="mb-2 rounded-md bg-notion-hover px-2 py-1 text-center text-xs font-medium text-ink-muted">
              {DAY_LABELS[day]}
            </div>
            <ul className="space-y-1">
              {(days[day] || []).map((t) => (
                <li key={t.id} className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(t.done)}
                    onChange={(e) => updateTodo(day, t.id, { done: e.target.checked })}
                    className="mt-0.5 rounded border-notion-border"
                  />
                  <input
                    value={t.text}
                    onChange={(e) => updateTodo(day, t.id, { text: e.target.value })}
                    className={`min-w-0 flex-1 bg-transparent outline-none ${t.done ? 'line-through text-ink-muted' : 'text-ink'}`}
                  />
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => addTodo(day)}
              className="mt-2 flex w-full items-center gap-1 rounded px-1 py-1 text-xs text-ink-muted hover:bg-notion-hover"
            >
              <Plus className="h-3 w-3" />
              New
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
