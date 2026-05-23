import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../store/authStore';
import { AuthCard } from '../components/auth/AuthCard';

const GOOGLE_ERRORS = {
  google_failed: 'Google sign-in failed. Try again or use email/password.',
  google_denied: 'Google sign-in was cancelled.',
  google_not_configured: 'Google sign-in is not configured on the server yet.',
  account_blocked: 'This account has been blocked.',
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: googleStatus } = useQuery({
    queryKey: ['google-status'],
    queryFn: async () => (await authApi.googleStatus()).data,
    staleTime: 60_000,
  });

  useEffect(() => {
    const code = searchParams.get('error');
    if (code && GOOGLE_ERRORS[code]) {
      setError(GOOGLE_ERRORS[code]);
    } else if (code) {
      const detail = searchParams.get('detail');
      setError(detail || 'Google sign-in failed.');
    }
  }, [searchParams]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authApi.login({ email, password });
      setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user });
      navigate(location.state?.from?.pathname || '/app', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = () => {
    if (googleStatus && !googleStatus.enabled) {
      setError('Google OAuth is not configured on the server.');
      return;
    }
    void authApi.googleLogin();
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to continue to your workspace."
      footer={
        <>
          <Link to="/forgot-password" className="text-indigo-600 hover:underline">
            Forgot password?
          </Link>
          <span className="mx-2">·</span>
          <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <label className="block text-sm font-medium text-ink-muted">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-notion-border bg-notion-hover px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-ink-muted">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-notion-border bg-notion-hover px-3 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Continue'}
        </button>
      </form>
      <button
        type="button"
        onClick={googleLogin}
        disabled={googleStatus && !googleStatus.enabled}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-notion-border py-2.5 text-sm font-semibold hover:bg-notion-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>
    </AuthCard>
  );
}
