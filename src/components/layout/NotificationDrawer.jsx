import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check } from 'lucide-react';
import { notificationApi } from '../../services/notificationApi';
import { useNotificationStore } from '../../store/notificationStore';

export function NotificationDrawer() {
  const open = useNotificationStore((s) => s.panelOpen);
  const setOpen = useNotificationStore((s) => s.setPanelOpen);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await notificationApi.list()).data,
    enabled: open,
  });

  const markRead = useMutation({
    mutationFn: (id) => notificationApi.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAll = useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ x: 380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 380, opacity: 0 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-slate-200/80 bg-surface shadow-2xl dark:border-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-200/80 px-4 py-3 dark:border-slate-800">
              <div className="flex items-center gap-2 font-semibold">
                <Bell className="h-4 w-4" />
                Notifications
              </div>
              <div className="flex gap-2">
                <button type="button" className="text-xs text-indigo-600 hover:underline" onClick={() => markAll.mutate()}>
                  Mark all read
                </button>
                <button type="button" className="text-xs text-ink-muted hover:text-ink" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {isLoading && <p className="p-4 text-sm text-ink-muted">Loading…</p>}
              {!isLoading && !(data || []).length && (
                <p className="p-4 text-sm text-ink-muted">You are all caught up.</p>
              )}
              <ul className="space-y-2">
                {(data || []).map((n) => (
                  <li
                    key={n._id}
                    className={`rounded-xl border px-3 py-2 text-sm ${
                      n.isRead ? 'border-slate-200/60 bg-surface-muted/30 dark:border-slate-800' : 'border-indigo-500/30 bg-indigo-500/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-ink">{n.message}</p>
                      {!n.isRead && (
                        <button
                          type="button"
                          className="shrink-0 rounded-lg p-1 text-indigo-600 hover:bg-indigo-500/10"
                          onClick={() => markRead.mutate(n._id)}
                          title="Mark read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-[10px] uppercase tracking-wide text-ink-muted">{n.type?.replaceAll('_', ' ')}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
