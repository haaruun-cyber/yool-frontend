import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { AuthCard } from '../components/auth/AuthCard';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setIsError(false);
    try {
      const { data } = await authApi.forgotPassword(email);
      const text = data.message || 'If an account exists, instructions were sent.';
      setMsg(text);
      setIsError(text.toLowerCase().includes('could not') || text.toLowerCase().includes('not configured'));
    } catch (err) {
      setMsg(err.response?.data?.message || 'Could not send reset email. Try again later.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset password"
      subtitle="We will email you a link to choose a new password."
      footer={
        <Link to="/login" className="text-indigo-600 hover:underline">
          Back to login
        </Link>
      }
    >
      {msg && (
        <p className={`mt-3 text-sm ${isError ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
          {msg}
        </p>
      )}
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <label className="block text-sm font-medium text-ink-muted">
          Email
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200/80 bg-surface-muted/40 px-3 py-2 text-sm dark:border-slate-800"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
    </AuthCard>
  );
}
