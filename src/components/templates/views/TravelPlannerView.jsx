import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { uid } from '../../../utils/templateContent';
import { DbToolbar } from '../DbToolbar';

const PACKING_SECTIONS = [
  { key: 'clothing', label: 'Clothing', icon: '👕' },
  { key: 'toiletries', label: 'Toiletries', icon: '🪥' },
  { key: 'electronics', label: 'Electronics', icon: '🎧' },
  { key: 'documents', label: 'Travel documents', icon: '📄' },
];

function PackingSection({ label, icon, items, onChange }) {
  const [open, setOpen] = useState(true);
  const add = () => onChange([...items, { id: uid(), text: 'Item', done: false }]);
  return (
    <div className="border-b border-notion-border py-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 py-1 text-left text-sm font-medium"
      >
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        <span>{icon}</span>
        {label}
      </button>
      {open && (
        <ul className="ml-6 mt-2 space-y-1">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={item.done}
                onChange={(e) =>
                  onChange(items.map((x) => (x.id === item.id ? { ...x, done: e.target.checked } : x)))
                }
              />
              <input
                value={item.text}
                onChange={(e) =>
                  onChange(items.map((x) => (x.id === item.id ? { ...x, text: e.target.value } : x)))
                }
                className={`flex-1 bg-transparent outline-none ${item.done ? 'line-through text-ink-muted' : ''}`}
              />
            </li>
          ))}
          <button type="button" onClick={add} className="flex items-center gap-1 text-xs text-ink-muted">
            <Plus className="h-3 w-3" /> Add item
          </button>
        </ul>
      )}
    </div>
  );
}

export function TravelPlannerView({ content, onChange }) {
  const packing = content.packing || {};
  const itinerary = content.itinerary || [];

  const setPacking = (key, items) => onChange({ ...content, packing: { ...packing, [key]: items } });
  const setItinerary = (next) => onChange({ ...content, itinerary: next });

  const addItinerary = () => {
    setItinerary([
      ...itinerary,
      { id: uid(), activity: 'New activity', date: new Date().toISOString(), notes: '' },
    ]);
  };

  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-2 text-lg font-semibold">Packing list</h2>
        <p className="mb-4 text-sm text-ink-muted">Expand each category to see your packing checklist.</p>
        {PACKING_SECTIONS.map(({ key, label, icon }) => (
          <PackingSection
            key={key}
            label={label}
            icon={icon}
            items={packing[key] || []}
            onChange={(items) => setPacking(key, items)}
          />
        ))}
      </section>

      <section>
        <DbToolbar title="Itinerary" onNew={addItinerary} newLabel="New" />
        <p className="mb-3 text-sm text-ink-muted">Fill in activities, dates, and notes for your trip.</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-notion-border text-left text-xs text-ink-muted">
              <th className="py-2 pr-3 font-normal">Activity</th>
              <th className="py-2 pr-3 font-normal">Date</th>
              <th className="py-2 font-normal">Notes</th>
            </tr>
          </thead>
          <tbody>
            {itinerary.map((row) => (
              <tr key={row.id} className="border-b border-notion-border hover:bg-notion-hover/50">
                <td className="py-2 pr-3">
                  <input
                    value={row.activity}
                    onChange={(e) =>
                      setItinerary(
                        itinerary.map((r) => (r.id === row.id ? { ...r, activity: e.target.value } : r))
                      )
                    }
                    className="w-full bg-transparent outline-none"
                  />
                </td>
                <td className="py-2 pr-3">
                  <input
                    type="datetime-local"
                    value={row.date ? new Date(row.date).toISOString().slice(0, 16) : ''}
                    onChange={(e) =>
                      setItinerary(
                        itinerary.map((r) =>
                          r.id === row.id ? { ...r, date: new Date(e.target.value).toISOString() } : r
                        )
                      )
                    }
                    className="w-full bg-transparent text-ink-muted outline-none"
                  />
                </td>
                <td className="py-2">
                  <input
                    value={row.notes || ''}
                    onChange={(e) =>
                      setItinerary(
                        itinerary.map((r) => (r.id === row.id ? { ...r, notes: e.target.value } : r))
                      )
                    }
                    className="w-full bg-transparent outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          onClick={addItinerary}
          className="mt-2 flex items-center gap-2 px-2 py-2 text-sm text-ink-muted hover:bg-notion-hover"
        >
          <Plus className="h-4 w-4" /> New page
        </button>
      </section>
    </div>
  );
}
