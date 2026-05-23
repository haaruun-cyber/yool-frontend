import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { userApi } from '../services/authApi';
import { Loader } from '../components/shared/Loader';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    const run = async () => {
      const accessToken = params.get('accessToken');
      const refreshToken = params.get('refreshToken');
      if (!accessToken || !refreshToken) {
        navigate('/login', { replace: true });
        return;
      }
      setSession({ accessToken, refreshToken, user: null });
      try {
        const { data } = await userApi.me();
        setSession({
          accessToken,
          refreshToken,
          user: {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
            subscriptionPlan: data.subscriptionPlan,
          },
        });
      } catch {
        setSession({ accessToken, refreshToken, user: { id: '', name: '', email: '', role: 'user', subscriptionPlan: 'free' } });
      }
      navigate('/app', { replace: true });
    };
    run();
  }, [params, navigate, setSession]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader />
    </div>
  );
}
