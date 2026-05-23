import { X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUiStore } from '../../store/uiStore';

export function LimitReachedCard() {
  const navigate = useNavigate();
  const limitModal = useUiStore((s) => s.limitModal);
  const closeLimitModal = useUiStore((s) => s.closeLimitModal);
  const setCheckoutPlan = useUiStore((s) => s.setCheckoutPlan);

  const titles = {
    documents: 'Document limit reached',
    ai: 'AI requires Pro or Team',
    templates: 'Premium template',
    generic: 'Upgrade required',
  };

  const descriptions = {
    documents:
      limitModal?.message ||
      `Your Free plan includes ${limitModal?.limit ?? 5} active documents. Upgrade to create unlimited pages.`,
    ai: limitModal?.message || 'Unlock AI writing, summaries, and meeting notes with Pro or Team.',
    templates: limitModal?.message || 'This template is available on Pro and Team plans.',
    generic: limitModal?.message || 'Upgrade your plan to continue.',
  };

  const type = limitModal?.type || 'generic';

  return (
    <AnimatePresence>
      {limitModal?.open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          onClick={closeLimitModal}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            role="dialog"
            aria-labelledby="limit-title"
            className="relative w-full max-w-md rounded-xl border border-notion-border bg-[rgb(var(--surface-elevated))] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeLimitModal}
              className="absolute right-3 top-3 rounded-md p-1 text-ink-muted hover:bg-notion-hover"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <motion.div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
              <Sparkles className="h-5 w-5 text-indigo-400" />
            </motion.div>
            <h2 id="limit-title" className="text-lg font-semibold text-ink">
              {titles[type] || titles.generic}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{descriptions[type] || descriptions.generic}</p>
            {type === 'documents' && limitModal?.used != null && limitModal?.limit != null && (
              <div className="mt-4">
                <motion.div className="h-2 overflow-hidden rounded-full bg-notion-hover">
                  <motion.div
                    className="h-full rounded-full bg-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (limitModal.used / limitModal.limit) * 100)}%` }}
                  />
                </motion.div>
                <p className="mt-1 text-xs text-ink-muted">
                  {limitModal.used} of {limitModal.limit} documents used
                </p>
              </div>
            )}
            <motion.div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setCheckoutPlan('pro');
                  closeLimitModal();
                }}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Upgrade with WaafiPay
              </button>
              <button
                type="button"
                onClick={() => {
                  closeLimitModal();
                  navigate('/app/pricing');
                }}
                className="rounded-lg border border-notion-border px-4 py-2 text-sm font-medium text-ink hover:bg-notion-hover"
              >
                View plans
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
