import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, History } from 'lucide-react';
import { aiApi } from '../../services/aiApi';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { handleApiLimitError } from '../../utils/limitError';

const tabs = [
  { id: 'summarize', label: 'Summarize' },
  { id: 'meeting', label: 'Meeting' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'write', label: 'Writing' },
];

export function AIAssistantPanel({ open, onClose, getEditorText }) {
  const [tab, setTab] = useState('summarize');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [instruction, setInstruction] = useState('Make this clearer and more concise.');
  const [history, setHistory] = useState([]);
  const plan = useAuthStore((s) => s.user?.subscriptionPlan);
  const locked = !['pro', 'team'].includes(plan || 'free');
  const openLimitModal = useUiStore((s) => s.openLimitModal);
  const setCheckoutPlan = useUiStore((s) => s.setCheckoutPlan);

  const run = async () => {
    if (locked) {
      openLimitModal({ type: 'ai' });
      return;
    }
    const text = getEditorText?.() || '';
    if (!text.trim()) {
      setOutput('Nothing to send — add some content first.');
      return;
    }
    setLoading(true);
    setOutput('');
    try {
      let res;
      if (tab === 'summarize') res = await aiApi.summarize(text);
      else if (tab === 'meeting') res = await aiApi.meetingSummary(text);
      else if (tab === 'tasks') res = await aiApi.generateTasks(text);
      else res = await aiApi.write(instruction, text);
      const body = res.data;
      const textOut =
        body.summary || body.output || (typeof body.tasks === 'string' ? body.tasks : JSON.stringify(body.tasks, null, 2));
      setOutput(textOut || JSON.stringify(body));
      setHistory((h) => [{ tab, at: Date.now(), preview: String(textOut).slice(0, 160) }, ...h].slice(0, 12));
    } catch (e) {
      if (!handleApiLimitError(e, openLimitModal)) {
        setOutput(e.response?.data?.message || e.message || 'Request failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: 360, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 360, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          className="fixed right-0 top-0 z-40 flex h-full w-full max-w-md flex-col border-l border-slate-200/80 bg-surface shadow-2xl dark:border-slate-800"
        >
          <div className="flex items-center justify-between border-b border-slate-200/80 px-4 py-3 dark:border-slate-800">
            <div className="flex items-center gap-2 font-semibold text-ink">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              AI assistant
            </div>
            <button type="button" className="text-sm text-ink-muted hover:text-ink" onClick={onClose}>
              Close
            </button>
          </div>
          {locked ? (
            <div className="space-y-4 p-4">
              <p className="text-sm text-ink-muted">AI tools are available on Pro and Team plans.</p>
              <button
                type="button"
                onClick={() => {
                  setCheckoutPlan('pro');
                  onClose();
                }}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Upgrade with WaafiPay
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-1 border-b border-slate-200/80 p-2 dark:border-slate-800">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                      tab === t.id ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-200' : 'text-ink-muted hover:bg-surface-muted'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {tab === 'write' && (
                  <label className="block text-xs font-medium text-ink-muted">
                    Instruction
                    <textarea
                      value={instruction}
                      onChange={(e) => setInstruction(e.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded-xl border border-slate-200/80 bg-surface-muted/40 p-2 text-sm text-ink dark:border-slate-800"
                    />
                  </label>
                )}
                <button
                  type="button"
                  disabled={loading}
                  onClick={run}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Run
                </button>
                <div>
                  <p className="mb-1 text-xs font-medium text-ink-muted">Output</p>
                  <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-xl border border-slate-200/80 bg-slate-950/90 p-3 text-xs text-slate-100 dark:border-slate-800">
                    {output || '—'}
                  </pre>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-1 text-xs font-medium text-ink-muted">
                    <History className="h-3 w-3" />
                    Recent runs (this session)
                  </p>
                  <ul className="space-y-1 text-xs text-ink-muted">
                    {history.map((h) => (
                      <li key={h.at} className="rounded-lg bg-surface-muted/50 px-2 py-1">
                        <span className="font-medium text-ink">{h.tab}</span> — {h.preview}
                      </li>
                    ))}
                    {!history.length && <li>No runs yet.</li>}
                  </ul>
                </div>
              </div>
            </>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
