import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { authApi, userApi } from '../services/authApi';
import { useAuthStore } from '../store/authStore';

export default function VerifyEmail() {
  const { token: tokenParam } = useParams();
  const [search] = useSearchParams();
  const token = tokenParam || search.get('token') || '';
  const [msg, setMsg] = useState('Verifying…');
  const setUser = useAuthStore((s) => s.setUser);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!token) {
      setMsg('Invalid or missing token.');
      return;
    }
    (async () => {
      try {
        await authApi.verifyEmail(token);
        if (accessToken) {
          try {
            const { data } = await userApi.me();
            setUser(data);
          } catch {
            const current = useAuthStore.getState().user;
            if (current) setUser({ ...current, emailVerified: true });
          }
        }
        setMsg('Email verified — you can create documents now.');
      } catch {
        setMsg('Invalid or expired link. Send a new verification email from Settings.');
      }
    })();
  }, [token, accessToken, setUser]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-lg font-semibold">{msg}</p>
      <Link to={accessToken ? '/app' : '/login'} className="mt-4 text-indigo-600 hover:underline">
        {accessToken ? 'Go to dashboard' : 'Go to login'}
      </Link>
    </div>
  );
}
