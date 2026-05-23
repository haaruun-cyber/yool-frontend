import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../services/authApi';
import { FileUpload } from '../components/editor/FileUpload';

export default function Profile() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => (await userApi.me()).data,
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!data) return;
    setName(data.name || '');
    setEmail(data.email || '');
  }, [data]);

  const save = useMutation({
    mutationFn: () => userApi.updateMe({ name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me'] }),
  });

  const avatar = useMutation({
    mutationFn: (file) => userApi.uploadAvatar(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me'] }),
  });

  if (isLoading) return <p className="text-sm text-ink-muted">Loading…</p>;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="rounded-2xl border border-slate-200/80 bg-surface p-6 dark:border-slate-800">
        <div className="mb-6 flex items-center gap-4">
          <img
            src={data.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name || '')}`}
            alt=""
            className="h-16 w-16 rounded-full border border-slate-200/80 object-cover dark:border-slate-800"
            loading="lazy"
          />
          <FileUpload label="Change photo" accept="image/*" onFile={(f) => f && avatar.mutate(f)} />
        </div>
        <label className="block text-sm font-medium text-ink-muted">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200/80 bg-surface-muted/40 px-3 py-2 text-sm dark:border-slate-800"
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-ink-muted">
          Email
          <input
            value={email}
            disabled
            className="mt-1 w-full cursor-not-allowed rounded-xl border border-slate-200/80 bg-slate-100 px-3 py-2 text-sm text-ink-muted dark:border-slate-800 dark:bg-slate-900"
          />
        </label>
        <p className="mt-2 text-xs text-ink-muted">Email changes require backend support. Use forgot password to reset access.</p>
        <button
          type="button"
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="mt-6 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          Save
        </button>
      </div>
    </div>
  );
}
