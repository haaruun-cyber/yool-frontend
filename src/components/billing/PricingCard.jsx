import { Check } from 'lucide-react';
import clsx from 'clsx';

export function PricingCard({ title, price, description, features, highlighted, onSelect }) {
  return (
    <div
      className={clsx(
        'flex flex-col rounded-2xl border p-6 shadow-card',
        highlighted
          ? 'border-indigo-500/60 bg-indigo-500/5'
          : 'border-slate-200/80 bg-surface dark:border-slate-800'
      )}
    >
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-ink">{price}</p>
      <p className="mt-2 text-sm text-ink-muted">{description}</p>
      <ul className="mt-6 flex-1 space-y-2 text-sm text-ink-muted">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            {f}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onSelect}
        className={clsx(
          'mt-6 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition',
          highlighted ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'border border-slate-200/80 hover:bg-surface-muted dark:border-slate-700'
        )}
      >
        Choose {title}
      </button>
    </div>
  );
}
