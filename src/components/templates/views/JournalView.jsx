import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { uid } from '../../../utils/templateContent';

export function JournalView({ content, onChange }) {
  const entries = content.entries || [];

  const setEntries = (next) => onChange({ ...content, entries: next });

  const addEntry = () => {
    setEntries([
      {
        id: uid(),
        date: new Date().toISOString(),
        title: 'New entry',
        body: '',
        open: true,
      },
      ...entries,
    ]);
  };

  const toggle = (id) => {
    setEntries(entries.map((e) => (e.id === id ? { ...e, open: !e.open } : e)));
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Journal entry';
    }
  };

  return (
    <div>
      <p className="mb-4 text-sm text-ink-muted">Click the button to add a new journal entry.</p>
      <button
        type="button"
        onClick={addEntry}
        className="mb-8 rounded-md border border-notion-border px-4 py-2 text-sm font-medium hover:bg-notion-hover"
      >
        Add new journal entry
      </button>
      <div className="space-y-2">
        {entries.map((entry) => (
          <div key={entry.id} className="rounded-md">
            <button
              type="button"
              onClick={() => toggle(entry.id)}
              className="flex w-full items-center gap-2 py-2 text-left text-sm font-medium"
            >
              {entry.open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <span className="text-ink-muted">@</span>
              {formatDate(entry.date)} —{' '}
              <input
                value={entry.title}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  setEntries(entries.map((x) => (x.id === entry.id ? { ...x, title: e.target.value } : x)))
                }
                className="min-w-0 flex-1 bg-transparent font-medium outline-none"
              />
            </button>
            {entry.open && (
              <textarea
                value={entry.body}
                onChange={(e) =>
                  setEntries(entries.map((x) => (x.id === entry.id ? { ...x, body: e.target.value } : x)))
                }
                rows={6}
                className="mb-4 w-full resize-y rounded-md bg-notion-hover/50 px-3 py-2 text-sm leading-relaxed outline-none"
                placeholder="Write your thoughts…"
              />
            )}
          </div>
        ))}
        {!entries.length && <p className="text-sm text-ink-muted">No entries yet.</p>}
      </div>
    </div>
  );
}
