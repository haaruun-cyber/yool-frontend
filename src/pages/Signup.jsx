import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../store/authStore';

export default function Signup() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: googleStatus } = useQuery({
    queryKey: ['google-status'],
    queryFn: async () => (await authApi.googleStatus()).data,
    staleTime: 60_000,
  });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const { data } = await authApi.register({ name, email, password });
      if (data.accessToken && data.user) {
        setSession({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
        });
        navigate('/app/settings', {
          replace: true,
          state: { verifyHint: true },
        });
        return;
      }
      setMsg(data.message || 'Account created.');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Could not register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-surface p-8 shadow-xl dark:border-slate-800">
        <h1 className="text-2xl font-bold">Create your Yool account</h1>
        <p className="mt-1 text-sm text-ink-muted">Free forever to start. No card required.</p>
        {msg && <p className="mt-3 text-sm text-ink-muted">{msg}</p>}
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-medium text-ink-muted">
            Name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200/80 bg-surface-muted/40 px-3 py-2 text-sm dark:border-slate-800"
            />
          </label>
          <label className="block text-sm font-medium text-ink-muted">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200/80 bg-surface-muted/40 px-3 py-2 text-sm dark:border-slate-800"
            />
          </label>
          <label className="block text-sm font-medium text-ink-muted">
            Password (min 8)
            <input
              type="password"
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200/80 bg-surface-muted/40 px-3 py-2 text-sm dark:border-slate-800"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>
        {googleStatus?.enabled && (
          <button
            type="button"
            onClick={() => void authApi.googleLogin()}
            className="mt-3 w-full rounded-xl border border-notion-border py-2.5 text-sm font-semibold hover:bg-notion-hover"
          >
            Continue with Google
          </button>
        )}
        <p className="mt-6 text-center text-sm text-ink-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
