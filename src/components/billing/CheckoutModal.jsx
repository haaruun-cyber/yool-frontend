import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../shared/Modal';
import { paymentApi } from '../../services/paymentApi';
import { userApi } from '../../services/authApi';
import { useAuthStore } from '../../store/authStore';

const PAYMENT_METHODS = [
  { value: 'MWALLET_ACCOUNT', label: 'Mobile wallet (MWALLET_ACCOUNT)' },
  { value: 'CREDIT_CARD', label: 'Card (CREDIT_CARD)' },
];

export function CheckoutModal({ open, onClose, plan }) {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('MWALLET_ACCOUNT');
  const [accountNo, setAccountNo] = useState('');

  const { data: catalogRes } = useQuery({
    queryKey: ['payment-plans'],
    queryFn: () => paymentApi.plans(),
    enabled: open && Boolean(plan),
    staleTime: 60_000,
  });

  const catalog = catalogRes?.data;
  const row = plan && catalog ? catalog[plan] : null;

  useEffect(() => {
    if (!open) {
      setError('');
      setInfo('');
      setAccountNo('');
      setPaymentMethod('MWALLET_ACCOUNT');
    }
  }, [open]);

  const submit = async () => {
    if (!plan) return;
    setLoading(true);
    setError('');
    setInfo('');
    try {
      const trimmed = accountNo.trim().replace(/\D/g, '');
      if (!trimmed) {
        setError('Mobile wallet number is required (e.g. 252611111111).');
        setLoading(false);
        return;
      }
      const payerInfo = { accountNo: trimmed };
      const { data } = await paymentApi.checkout({
        plan,
        paymentMethod,
        accountNo: trimmed,
        payerInfo,
      });
      if (data.subscriptionUpdated) {
        try {
          const me = await userApi.me();
          setUser(me.data);
        } catch {
          await qc.invalidateQueries({ queryKey: ['me'] });
        }
        await qc.invalidateQueries({ queryKey: ['usage'] });
        onClose();
        return;
      }
      setInfo(data?.waafiResponse?.responseMsg || 'Payment could not be confirmed. Check your wallet and try again.');
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Pay with WaafiPay" size="sm">
      <p className="text-sm text-ink-muted">
        Complete <strong className="text-ink">{plan}</strong>
        {row ? (
          <>
            {' '}
            — <strong>{row.amount}</strong> {catalog.currency}
          </>
        ) : null}
        . Use the payment method codes from your{' '}
        <a
          href="https://docs.waafipay.com"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-indigo-600 hover:underline"
        >
          WaafiPay
        </a>{' '}
        merchant integration.
      </p>
      <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-ink-muted">Payment method</label>
      <select
        className="mt-1 w-full rounded-xl border border-slate-200/80 bg-surface px-3 py-2 text-sm dark:border-slate-700"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        {PAYMENT_METHODS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
      <label className="mt-3 block text-xs font-medium uppercase tracking-wide text-ink-muted">
        Mobile wallet number
      </label>
      <input
        type="tel"
        required
        className="mt-1 w-full rounded-xl border border-slate-200/80 bg-surface px-3 py-2 text-sm dark:border-slate-700"
        placeholder="252611111111"
        value={accountNo}
        onChange={(e) => setAccountNo(e.target.value)}
      />
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      {info && <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">{info}</p>}
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          className="rounded-xl px-3 py-2 text-sm text-ink-muted hover:bg-surface-muted"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={loading || !plan}
          onClick={submit}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? 'Processing…' : 'Pay with WaafiPay'}
        </button>
      </div>
    </Modal>
  );
}
