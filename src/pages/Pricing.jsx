import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PricingCard } from '../components/billing/PricingCard';
import { CheckoutModal } from '../components/billing/CheckoutModal';
import { paymentApi } from '../services/paymentApi';

function formatPlanPrice(currency, amount) {
  if (amount == null || !currency) return '—';
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(Number(amount));
  } catch {
    return `${amount} ${currency}`;
  }
}

export default function Pricing() {
  const [plan, setPlan] = useState(null);
  const [portalHint, setPortalHint] = useState('');

  const { data: plansRes } = useQuery({
    queryKey: ['payment-plans'],
    queryFn: () => paymentApi.plans(),
    staleTime: 60_000,
  });

  const catalog = plansRes?.data;
  const proPrice = catalog ? formatPlanPrice(catalog.currency, catalog.pro?.amount) : '$12/mo';
  const teamPrice = catalog ? formatPlanPrice(catalog.currency, catalog.team?.amount) : '$24/mo';

  const portal = useMutation({
    mutationFn: () => paymentApi.portal(),
    onSuccess: (res) => {
      setPortalHint('');
      if (res.data?.url) window.location.href = res.data.url;
      else setPortalHint(res.data?.message || 'No merchant portal URL is configured.');
    },
    onError: (e) => setPortalHint(e.response?.data?.message || e.message),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Plans</h1>
        <p className="text-sm text-ink-muted">Upgrade when you need AI, unlimited docs, and team tools. Billing runs through WaafiPay.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <PricingCard
          title="Free"
          price="$0"
          description="For getting started"
          features={['5 active documents', 'Core templates', 'Tasks & journals']}
          onSelect={() => {}}
        />
        <PricingCard
          title="Pro"
          price={catalog ? `${proPrice}/mo` : '$12/mo'}
          description="For power users"
          highlighted
          features={['Unlimited documents', 'AI writing & summaries', 'Premium templates', 'Priority support']}
          onSelect={() => setPlan('pro')}
        />
        <PricingCard
          title="Team"
          price={catalog ? `${teamPrice}/mo` : '$24/mo'}
          description="For small teams"
          features={['Everything in Pro', 'Collaboration tools', 'Shared libraries', 'Admin insights']}
          onSelect={() => setPlan('team')}
        />
      </div>
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => {
            setPortalHint('');
            portal.mutate();
          }}
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          Open Waafi merchant / customer portal
        </button>
        {portalHint && <p className="text-sm text-ink-muted">{portalHint}</p>}
      </div>
      <CheckoutModal open={Boolean(plan)} onClose={() => setPlan(null)} plan={plan} />
    </div>
  );
}
