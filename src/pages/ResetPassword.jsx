import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await authApi.resetPassword(token, password);
      setMsg('Password updated — you can log in now.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-surface p-8 shadow-xl dark:border-slate-800">
        <h1 className="text-2xl font-bold">Choose a new password</h1>
        {msg && <p className="mt-3 text-sm text-ink-muted">{msg}</p>}
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <input
            type="password"
            minLength={8}
            required
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-200/80 bg-surface-muted/40 px-3 py-2 text-sm dark:border-slate-800"
          />
          <button type="submit" className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white">
            Update password
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="text-indigo-600 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
