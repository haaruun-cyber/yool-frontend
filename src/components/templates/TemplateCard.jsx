import { Crown, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { DocumentTypeIcon } from '../../utils/docIcons';

export function TemplateCard({ template, onUse, onDuplicate }) {
  return (
    <motion.div
      layout
      className="flex flex-col rounded-2xl border border-slate-200/80 bg-surface p-4 shadow-card dark:border-slate-800"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <DocumentTypeIcon type={template.category} className="h-5 w-5 text-indigo-500" />
          <div>
            <h3 className="font-semibold text-ink">{template.title}</h3>
            <p className="text-xs capitalize text-ink-muted">{String(template.category || '').replaceAll('_', ' ')}</p>
          </div>
        </div>
        {template.isPremium && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-700 dark:text-amber-300">
            <Crown className="h-3 w-3" />
            Pro
          </span>
        )}
      </div>
      <div className="mt-auto flex gap-2 pt-3">
        <button
          type="button"
          onClick={() => onUse?.(template)}
          className="flex-1 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Use template
        </button>
        <button
          type="button"
          title="Duplicate to your workspace"
          onClick={() => onDuplicate?.(template)}
          className="rounded-xl border border-slate-200/80 p-2 text-ink-muted hover:bg-surface-muted dark:border-slate-700"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
