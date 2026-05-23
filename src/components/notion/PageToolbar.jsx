import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ChevronRight,
  Star,
  MoreHorizontal,
  Menu,
  Sparkles,
  LogOut,
  Copy,
  Archive,
  Trash2,
} from 'lucide-react';
import { documentApi } from '../../services/documentApi';
import { formatDistanceToNow } from '../../utils/formatDate';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../services/authApi';
import { Modal } from '../shared/Modal';

export function PageToolbar() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const setMobileOpen = useUiStore((s) => s.setMobileSidebarOpen);
  const setAiOpen = useUiStore((s) => s.setAiPanelOpen);
  const openLimitModal = useUiStore((s) => s.openLimitModal);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    try {
      await authApi.logout(refreshToken);
    } catch {
      /* ignore */
    }
    logout();
    navigate('/login', { replace: true });
  };

  const [shareOpen, setShareOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [sharePerm, setSharePerm] = useState('read');

  const { data: doc } = useQuery({
    queryKey: ['document', id],
    queryFn: async () => (await documentApi.get(id)).data,
    enabled: Boolean(id),
  });

  const toggleFav = useMutation({
    mutationFn: () => documentApi.favorite(id, !doc?.isFavorite),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['document', id] }),
  });

  const share = useMutation({
    mutationFn: () => documentApi.share(id, { email: shareEmail, permission: sharePerm }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['document', id] });
      setShareOpen(false);
      setShareEmail('');
    },
  });

  const duplicate = useMutation({
    mutationFn: () => documentApi.duplicate(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['documents'] });
      setMoreOpen(false);
      navigate(`/app/doc/${res.data._id}`);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || '';
      if (err.response?.status === 402) {
        openLimitModal({ type: 'documents', message: msg });
        setMoreOpen(false);
      }
    },
  });

  const archive = useMutation({
    mutationFn: () => documentApi.archive(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents'] });
      setMoreOpen(false);
      navigate('/app');
    },
  });

  const remove = useMutation({
    mutationFn: () => documentApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents'] });
      setMoreOpen(false);
      navigate('/app');
    },
  });

  const sectionLabel = (() => {
    if (location.pathname.includes('/favorites')) return 'Favorites';
    if (location.pathname.includes('/shared')) return 'Shared';
    if (location.pathname.includes('/private')) return 'Private';
    if (location.pathname.includes('/templates')) return 'Templates';
    return 'Project Planner';
  })();

  if (!id) {
    return (
      <header className="flex h-11 shrink-0 items-center gap-2 border-b border-notion-border px-3 text-sm">
        <button
          type="button"
          className="rounded-md p-1.5 text-ink-muted hover:bg-notion-hover md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>
        <span className="font-medium text-ink">{sectionLabel}</span>
        <span className="hidden text-ink-muted sm:inline">/ Private</span>
      </header>
    );
  }

  const edited = doc?.updatedAt || doc?.lastEdited;

  return (
    <>
      <header className="flex h-11 shrink-0 items-center gap-2 border-b border-notion-border px-3 text-sm">
        <button
          type="button"
          className="rounded-md p-1.5 text-ink-muted hover:bg-notion-hover md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>
        <nav className="flex min-w-0 flex-1 items-center gap-1 text-ink-muted">
          <Link to="/app" className="truncate hover:text-ink">
            {sectionLabel}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
          <span className="truncate font-medium text-ink">{doc?.title || 'Untitled'}</span>
          {doc?.isPrivate && (
            <>
              <span className="opacity-40">/</span>
              <span className="text-xs">Private</span>
            </>
          )}
        </nav>
        <div className="flex shrink-0 items-center gap-0.5">
          {edited && (
            <span className="hidden text-xs text-ink-muted sm:inline">
              Edited {formatDistanceToNow(edited)}
            </span>
          )}
          <button
            type="button"
            onClick={() => setAiOpen(true)}
            className="rounded-md p-1.5 text-ink-muted hover:bg-notion-hover"
            title="AI assistant"
          >
            <Sparkles className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="rounded-md px-2 py-1 text-xs font-medium text-ink-muted hover:bg-notion-hover hover:text-ink"
          >
            Share
          </button>
          <button
            type="button"
            onClick={() => toggleFav.mutate()}
            className="rounded-md p-1.5 text-ink-muted hover:bg-notion-hover"
            aria-label="Favorite"
          >
            <Star className={`h-4 w-4 ${doc?.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="rounded-md p-1.5 text-ink-muted hover:bg-notion-hover"
            aria-label="More"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md p-1.5 text-ink-muted hover:bg-notion-hover hover:text-red-600"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <Modal open={shareOpen} onClose={() => setShareOpen(false)} title="Share">
        <label className="block text-sm text-ink-muted">
          Email
          <input
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-notion-border bg-notion-hover px-3 py-2 text-sm"
          />
        </label>
        <label className="mt-3 block text-sm text-ink-muted">
          Permission
          <select
            value={sharePerm}
            onChange={(e) => setSharePerm(e.target.value)}
            className="mt-1 w-full rounded-lg border border-notion-border bg-notion-hover px-3 py-2 text-sm"
          >
            <option value="read">Can view</option>
            <option value="edit">Can edit</option>
          </select>
        </label>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="rounded-lg px-3 py-2 text-sm text-ink-muted" onClick={() => setShareOpen(false)}>
            Cancel
          </button>
          <button
            type="button"
            disabled={share.isPending || !shareEmail.includes('@')}
            onClick={() => share.mutate()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Invite
          </button>
        </div>
      </Modal>

      <Modal open={moreOpen} onClose={() => setMoreOpen(false)} title="Page options" size="sm">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => duplicate.mutate()}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-notion-hover"
          >
            <Copy className="h-4 w-4" />
            Duplicate
          </button>
          <button
            type="button"
            onClick={() => archive.mutate()}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-notion-hover"
          >
            <Archive className="h-4 w-4" />
            Archive
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Delete this page permanently?')) remove.mutate();
            }}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-red-500 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}
