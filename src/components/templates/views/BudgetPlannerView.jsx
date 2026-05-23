import { Plus } from 'lucide-react';
import { uid } from '../../../utils/templateContent';
import { DbToolbar } from '../DbToolbar';

function MoneyTable({ title, icon, rows, onChange, onNew }) {
  const sum = rows.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const fmt = (n) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);

  const update = (id, patch) => onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <section className="flex-1 min-w-[280px]">
      <DbToolbar title={title} onNew={onNew} newLabel="New" />
      <div className="mb-2 flex items-center gap-2 text-lg font-semibold">
        <span>{icon}</span>
        {title}
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-notion-border text-left text-xs text-ink-muted">
            <th className="py-2 font-normal">Item</th>
            <th className="py-2 font-normal text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-notion-border">
              <td className="py-1.5 pr-2">
                <input
                  value={row.item}
                  onChange={(e) => update(row.id, { item: e.target.value })}
                  className="w-full bg-transparent outline-none"
                />
              </td>
              <td className="py-1.5 text-right">
                <input
                  type="number"
                  step="0.01"
                  value={row.amount}
                  onChange={(e) => update(row.id, { amount: parseFloat(e.target.value) || 0 })}
                  className="w-28 bg-transparent text-right outline-none"
                />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="py-2 text-xs text-ink-muted">SUM</td>
            <td className="py-2 text-right text-sm font-medium">{fmt(sum)}</td>
          </tr>
        </tfoot>
      </table>
      <button
        type="button"
        onClick={onNew}
        className="mt-1 flex items-center gap-2 px-2 py-2 text-sm text-ink-muted hover:bg-notion-hover"
      >
        <Plus className="h-4 w-4" /> New page
      </button>
    </section>
  );
}

export function BudgetPlannerView({ content, onChange }) {
  const income = content.income || [];
  const expenses = content.expenses || [];

  return (
    <div>
      <p className="mb-6 text-sm text-ink-muted">
        Track monthly income and expenses. Totals update automatically.
      </p>
      <div className="flex flex-col gap-8 lg:flex-row">
        <MoneyTable
          title="Income (Monthly)"
          icon="🟢"
          rows={income}
          onChange={(next) => onChange({ ...content, income: next })}
          onNew={() => onChange({ ...content, income: [...income, { id: uid(), item: 'New income', amount: 0 }] })}
        />
        <MoneyTable
          title="Expenses (Monthly)"
          icon="🔴"
          rows={expenses}
          onChange={(next) => onChange({ ...content, expenses: next })}
          onNew={() =>
            onChange({ ...content, expenses: [...expenses, { id: uid(), item: 'New expense', amount: 0 }] })
          }
        />
      </div>
    </div>
  );
}
