import { Bell, Menu, Moon, Search, Sun, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../store/uiStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../services/authApi';

export function Navbar({ onOpenMobile }) {
  const navigate = useNavigate();
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);
  const setPanelOpen = useNotificationStore((s) => s.setPanelOpen);
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
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200/80 bg-surface/80 px-4 backdrop-blur dark:border-slate-800">
      <button
        type="button"
        className="inline-flex rounded-lg p-2 text-ink-muted hover:bg-surface-muted md:hidden"
        onClick={onOpenMobile}
      >
        <Menu className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => navigate('/app')}
        className="hidden items-center gap-2 rounded-xl border border-slate-200/80 bg-surface-muted/50 px-3 py-1.5 text-sm text-ink-muted transition hover:border-slate-300 md:flex dark:border-slate-800"
      >
        <Search className="h-4 w-4" />
        <span>Search workspace…</span>
        <kbd className="ml-6 rounded bg-surface px-1.5 py-0.5 text-[10px] font-medium text-ink-muted">⌘K</kbd>
      </button>
      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          className="rounded-lg p-2 text-ink-muted hover:bg-surface-muted"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button
          type="button"
          className="rounded-lg p-2 text-ink-muted hover:bg-surface-muted"
          onClick={() => setPanelOpen(true)}
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg p-2 text-ink-muted hover:bg-surface-muted"
          title="Log out"
        >
          <LogOut className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => navigate('/app/profile')}
          className="ml-1 flex items-center gap-2 rounded-full border border-slate-200/80 py-1 pl-1 pr-3 text-left text-sm dark:border-slate-800"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
            {(user?.name || user?.email || '?').slice(0, 1).toUpperCase()}
          </span>
          <span className="hidden max-w-[120px] truncate font-medium text-ink sm:block">{user?.name || 'Account'}</span>
        </button>
      </div>
    </header>
  );
}
