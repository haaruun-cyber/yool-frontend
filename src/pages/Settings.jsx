import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Mail } from 'lucide-react';
import { useUiStore } from '../store/uiStore';
import { useNotificationStore } from '../store/notificationStore';
import { useAuthStore } from '../store/authStore';
import { authApi, userApi } from '../services/authApi';

export default function Settings() {
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);
  const setNotif = useNotificationStore((s) => s.setPanelOpen);
  const navigate = useNavigate();
  const location = useLocation();
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [notifEmail, setNotifEmail] = useState(true);
  const [verifyMsg, setVerifyMsg] = useState(
    location.state?.verifyHint ? 'Welcome! Send a verification email below to unlock document creation.' : ''
  );
  const [verifyLoading, setVerifyLoading] = useState(false);

  const { data: meRes } = useQuery({
    queryKey: ['me'],
    queryFn: () => userApi.me(),
    staleTime: 30_000,
  });

  const me = meRes?.data;
  const emailVerified = me?.emailVerified ?? user?.emailVerified;

  const sendVerification = async () => {
    setVerifyLoading(true);
    setVerifyMsg('');
    try {
      const { data } = await authApi.sendVerification();
      const text = data.message || 'Verification email sent.';
      setVerifyMsg(text);
      if (!data.sent) setVerifyMsg(`${text} Use a Gmail App Password in EMAIL_PASS if using Gmail.`);
    } catch (err) {
      setVerifyMsg(err.response?.data?.message || 'Could not send verification email.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const { data } = await userApi.me();
      setUser(data);
      await qc.invalidateQueries({ queryKey: ['me'] });
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      <section className="rounded-2xl border border-slate-200/80 bg-surface p-5 dark:border-slate-800">
        <h2 className="font-semibold">Email verification</h2>
        <p className="mt-1 text-sm text-ink-muted">
          You must verify your email before creating documents or using templates.
        </p>
        {emailVerified ? (
          <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            {me?.email || user?.email} is verified
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-ink-muted">
              Signed in as <strong className="text-ink">{me?.email || user?.email}</strong> — not verified yet.
            </p>
            <button
              type="button"
              disabled={verifyLoading}
              onClick={sendVerification}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              <Mail className="h-4 w-4" aria-hidden />
              {verifyLoading ? 'Sending…' : 'Send verification email'}
            </button>
            <button
              type="button"
              onClick={refreshProfile}
              className="ml-2 text-sm text-ink-muted hover:text-ink"
            >
              Refresh status
            </button>
            {verifyMsg && <p className="text-sm text-ink-muted">{verifyMsg}</p>}
            <p className="text-xs text-ink-muted">
              Open the link in the email, then click &quot;Refresh status&quot; or reload the app.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-surface p-5 dark:border-slate-800">
        <h2 className="font-semibold">Appearance</h2>
        <p className="text-sm text-ink-muted">Switch between light and dark themes.</p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${theme === 'light' ? 'bg-indigo-600 text-white' : 'border border-slate-200/80'}`}
          >
            Light
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'border border-slate-200/80'}`}
          >
            Dark
          </button>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200/80 bg-surface p-5 dark:border-slate-800">
        <h2 className="font-semibold">Notifications</h2>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)} />
          Email me about shared documents and billing
        </label>
        <button type="button" className="mt-3 text-sm text-indigo-600 hover:underline" onClick={() => setNotif(true)}>
          Open notification center
        </button>
      </section>
      <section className="rounded-2xl border border-slate-200/80 bg-surface p-5 dark:border-slate-800">
        <h2 className="font-semibold">Billing</h2>
        <p className="text-sm text-ink-muted">Manage subscription and invoices.</p>
        <button type="button" className="mt-3 text-sm font-semibold text-indigo-600 hover:underline" onClick={() => navigate('/app/pricing')}>
          View plans
        </button>
      </section>
      <section className="rounded-2xl border border-red-200/80 bg-red-500/5 p-5 dark:border-red-900/50">
        <h2 className="font-semibold text-red-600">Danger zone</h2>
        <p className="text-sm text-ink-muted">Delete your account and workspace data.</p>
        <button
          type="button"
          className="mt-3 rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-500/10"
          onClick={() => alert('Connect DELETE /users/me on the API to enable account deletion.')}
        >
          Delete account
        </button>
      </section>
    </div>
  );
}
