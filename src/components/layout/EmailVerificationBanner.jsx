import { Link } from 'react-router-dom';
import { MailWarning } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function EmailVerificationBanner() {
  const user = useAuthStore((s) => s.user);
  if (!user || user.emailVerified) return null;

  return (
    <div className="border-b border-amber-200/80 bg-amber-50 px-4 py-2.5 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2 md:justify-between">
        <span className="inline-flex items-center gap-2 font-medium">
          <MailWarning className="h-4 w-4 shrink-0" aria-hidden />
          Verify your email to create documents and use templates.
        </span>
        <Link to="/app/settings" className="font-semibold text-amber-900 underline hover:no-underline dark:text-amber-200">
          Go to Settings →
        </Link>
      </div>
    </div>
  );
}
