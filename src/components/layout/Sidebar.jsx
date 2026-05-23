import { NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  Home,
  Star,
  Users,
  Lock,
  LayoutTemplate,
  Settings,
  Sparkles,
  Shield,
  Search,
  Inbox,
  Plus,
  ChevronDown,
  Calendar,
  X,
} from 'lucide-react';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { documentApi } from '../../services/documentApi';
import { userApi } from '../../services/authApi';
import { DocumentTypeIcon } from '../../utils/docIcons';
import { SidebarUserFooter } from './SidebarUserFooter';

const navLink = ({ isActive }) =>
  clsx(
    'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
    isActive ? 'bg-notion-hover font-medium text-ink' : 'text-ink-muted hover:bg-notion-hover hover:text-ink'
  );

export function Sidebar({ onNavigate }) {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { id: activeDocId } = useParams();
  const setSearchOpen = useUiStore((s) => s.setSearchOpen);
  const openLimitModal = useUiStore((s) => s.openLimitModal);
  const hideCollabCard = useUiStore((s) => s.hideCollabCard);
  const setHideCollabCard = useUiStore((s) => s.setHideCollabCard);
  const isAdmin = user?.role === 'admin';
  const workspaceName = user?.name ? `${user.name}'s Workspace` : 'My Workspace';

  const { data: docs } = useQuery({
    queryKey: ['documents', 'active'],
    queryFn: async () => (await documentApi.list({ archived: 'false' })).data,
  });

  const { data: usage } = useQuery({
    queryKey: ['usage'],
    queryFn: async () => (await userApi.usage()).data,
    staleTime: 30_000,
  });

  const recents = [...(docs || [])]
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    .slice(0, 6);

  const privateDocs = (docs || []).filter(
    (d) => d.isPrivate && String(d.ownerId) === String(user?.id)
  );

  const tryNewPage = () => {
    if (usage?.documents?.limit != null && usage.documents.used >= usage.documents.limit) {
      openLimitModal({
        type: 'documents',
        message: `Free plan allows ${usage.documents.limit} active documents.`,
        used: usage.documents.used,
        limit: usage.documents.limit,
      });
      return;
    }
    onNavigate?.();
    navigate('/app');
  };

  const Item = ({ to, icon: Icon, children, end }) => (
    <NavLink to={to} end={end} className={navLink} onClick={() => onNavigate?.()}>
      <Icon className="h-4 w-4 shrink-0 opacity-80" />
      <span className="truncate">{children}</span>
    </NavLink>
  );

  const PageLink = ({ doc }) => {
    const active = activeDocId === doc._id;
    return (
      <button
        type="button"
        onClick={() => {
          onNavigate?.();
          navigate(`/app/doc/${doc._id}`);
        }}
        className={clsx(
          'flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm',
          active ? 'bg-notion-hover font-medium text-ink' : 'text-ink-muted hover:bg-notion-hover hover:text-ink'
        )}
      >
        <DocumentTypeIcon type={doc.type} className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{doc.title || 'Untitled'}</span>
      </button>
    );
  };

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-notion-border bg-surface-muted/30 text-sm">
      <div className="flex items-center justify-between gap-1 px-3 py-3">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-1 rounded-md px-1 py-1 text-sm font-medium text-ink hover:bg-notion-hover"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-indigo-600 text-[10px] font-bold text-white">
            Y
          </span>
          <span className="truncate">{workspaceName}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
        </button>
      </div>

      <div className="flex items-center gap-0.5 px-2 pb-2">
        <button
          type="button"
          title="Home"
          className="rounded-md p-1.5 text-ink-muted hover:bg-notion-hover"
          onClick={() => {
            onNavigate?.();
            navigate('/app');
          }}
        >
          <Home className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Search (Ctrl+K)"
          className="rounded-md p-1.5 text-ink-muted hover:bg-notion-hover"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Inbox"
          className="rounded-md p-1.5 text-ink-muted hover:bg-notion-hover"
          onClick={() => {
            onNavigate?.();
            navigate('/app');
          }}
        >
          <Inbox className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Calendar"
          className="rounded-md p-1.5 text-ink-muted hover:bg-notion-hover"
          onClick={() => {
            onNavigate?.();
            navigate('/app/pricing');
          }}
        >
          <Calendar className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-2 pb-4">
        <div>
          <p className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wide text-ink-muted">Meetings</p>
          <p className="px-2 text-xs text-ink-muted">Connect your calendar (coming soon)</p>
          <button
            type="button"
            className="mt-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-ink-muted hover:bg-notion-hover"
          >
            <Plus className="h-3.5 w-3.5" />
            New AI meeting note
          </button>
        </div>

        <div className="space-y-0.5">
          <Item to="/app" icon={Home} end>
            Home
          </Item>
          <Item to="/app/favorites" icon={Star}>
            Favorites
          </Item>
          <Item to="/app/shared" icon={Users}>
            Shared
          </Item>
        </div>

        {recents.length > 0 && (
          <div>
            <p className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wide text-ink-muted">Recents</p>
            <div className="space-y-0.5">
              {recents.map((doc) => (
                <PageLink key={doc._id} doc={doc} />
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="mb-1 flex items-center justify-between px-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">Private</p>
            <button
              type="button"
              onClick={tryNewPage}
              className="rounded p-0.5 text-ink-muted hover:bg-notion-hover"
              title="New page"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-0.5">
            {privateDocs.slice(0, 12).map((doc) => (
              <PageLink key={doc._id} doc={doc} />
            ))}
            {!privateDocs.length && (
              <p className="px-2 text-xs text-ink-muted">No private pages yet</p>
            )}
          </div>
        </div>

        <div className="space-y-0.5 border-t border-notion-border pt-3">
          <Item to="/app/private" icon={Lock}>
            All private
          </Item>
          <Item to="/app/templates" icon={LayoutTemplate}>
            Templates
          </Item>
          <Item to="/app/pricing" icon={Sparkles}>
            Pricing
          </Item>
          <Item to="/app/settings" icon={Settings}>
            Settings
          </Item>
          {isAdmin && (
            <Item to="/app/admin" icon={Shield}>
              Admin
            </Item>
          )}
        </div>
      </nav>

      <div className="space-y-2 border-t border-notion-border p-2">
        {!hideCollabCard && (
          <div className="relative rounded-lg border border-notion-border bg-notion-hover/50 p-3 text-xs text-ink-muted">
            <button
              type="button"
              onClick={() => setHideCollabCard(true)}
              className="absolute right-1 top-1 rounded p-0.5 hover:bg-notion-hover"
              aria-label="Dismiss"
            >
              <X className="h-3 w-3" />
            </button>
            <p className="pr-4 font-medium text-ink">Find friends to collaborate with</p>
            <p className="mt-1">Import contacts to start collaborating.</p>
          </div>
        )}
        <button
          type="button"
          onClick={tryNewPage}
          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-ink-muted hover:bg-notion-hover"
        >
          <Plus className="h-4 w-4" />
          New page
        </button>
      </div>
      <SidebarUserFooter onNavigate={onNavigate} />
    </aside>
  );
}
