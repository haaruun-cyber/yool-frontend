import { Outlet, useLocation, useParams } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { useUiStore } from '../../store/uiStore';
import { NotificationDrawer } from './NotificationDrawer';
import { PageToolbar } from '../notion/PageToolbar';
import { LimitReachedCard } from '../notion/LimitReachedCard';
import { SearchModal } from '../notion/SearchModal';
import { CheckoutModal } from '../billing/CheckoutModal';
import { EmailVerificationBanner } from './EmailVerificationBanner';

export function AppShell() {
  const mobileOpen = useUiStore((s) => s.mobileSidebarOpen);
  const setMobileOpen = useUiStore((s) => s.setMobileSidebarOpen);
  const checkoutPlan = useUiStore((s) => s.checkoutPlan);
  const clearCheckoutPlan = useUiStore((s) => s.clearCheckoutPlan);
  const location = useLocation();
  const { id } = useParams();
  const isDocRoute = location.pathname.includes('/app/doc/');

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-ink">
      <div className="hidden w-60 shrink-0 md:block">
        <Sidebar />
      </div>
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <PageToolbar />
        <EmailVerificationBanner />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <NotificationDrawer />
      <SearchModal />
      <LimitReachedCard />
      <CheckoutModal
        open={Boolean(checkoutPlan)}
        onClose={clearCheckoutPlan}
        plan={checkoutPlan}
      />
    </div>
  );
}
