import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';
import { DocumentListSkeleton } from '../components/shared/Skeleton';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

export default function AdminDashboard() {
  const role = useAuthStore((s) => s.user?.role);
  const qc = useQueryClient();

  const users = useQuery({ queryKey: ['admin-users'], queryFn: async () => (await adminApi.users()).data, enabled: role === 'admin' });
  const analytics = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => (await adminApi.analytics()).data,
    enabled: role === 'admin',
  });

  const block = useMutation({
    mutationFn: ({ id, isBlocked }) => adminApi.blockUser(id, isBlocked),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  if (role !== 'admin') return <Navigate to="/app" replace />;

  if (users.isLoading) return <DocumentListSkeleton />;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin</h1>
      {analytics.data && (
        <div className="grid gap-4 md:grid-cols-3">
          {['totalUsers', 'paidUsers', 'documents'].map((k) => (
            <div key={k} className="rounded-2xl border border-slate-200/80 bg-surface p-4 dark:border-slate-800">
              <p className="text-xs uppercase text-ink-muted">{k}</p>
              <p className="mt-1 text-2xl font-bold">{analytics.data[k] ?? '—'}</p>
            </div>
          ))}
        </div>
      )}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-muted/60 text-xs uppercase text-ink-muted">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(users.data || []).map((u) => (
              <tr key={u._id} className="border-t border-slate-200/60 dark:border-slate-800">
                <td className="px-4 py-3">
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-ink-muted">{u.email}</div>
                </td>
                <td className="px-4 py-3 capitalize">{u.subscriptionPlan}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                    onClick={() => block.mutate({ id: u._id, isBlocked: !u.isBlocked })}
                  >
                    {u.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
