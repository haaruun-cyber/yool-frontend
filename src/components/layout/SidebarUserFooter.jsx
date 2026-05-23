import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../services/authApi';

export function SidebarUserFooter({ onNavigate }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    try {
      await authApi.logout(refreshToken);
    } catch {
      /* ignore */
    }
    logout();
    onNavigate?.();
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  return (
    <div className="border-t border-notion-border p-2">
      <div className="mt-1 flex gap-1">
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            navigate('/app/profile');
          }}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-ink-muted hover:bg-notion-hover hover:text-ink"
        >
          <User className="h-3.5 w-3.5" />
          Profile
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className={clsx(
            'flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium',
            'text-red-600 hover:bg-red-500/10 dark:text-red-400'
          )}
        >
          <LogOut className="h-3.5 w-3.5" />
          Log out
        </button>
      </div>
    </div>
  );
}
