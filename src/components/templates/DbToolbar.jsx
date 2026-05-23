import { Plus, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export function DbToolbar({ title, onNew, newLabel = 'New' }) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <div className="flex items-center gap-1">
        <button type="button" className="rounded-md p-1.5 text-ink-muted hover:bg-notion-hover" title="Filter">
          <SlidersHorizontal className="h-4 w-4" />
        </button>
        <button type="button" className="rounded-md p-1.5 text-ink-muted hover:bg-notion-hover" title="Sort">
          <ArrowUpDown className="h-4 w-4" />
        </button>
        <button type="button" className="rounded-md p-1.5 text-ink-muted hover:bg-notion-hover" title="Search">
          <Search className="h-4 w-4" />
        </button>
        {onNew && (
          <button
            type="button"
            onClick={onNew}
            className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {newLabel}
            <span className="text-xs opacity-80">▾</span>
          </button>
        )}
      </div>
    </div>
  );
}
