export function isEmailVerificationError(err) {
  const status = err.response?.status;
  const code = err.response?.data?.code;
  if (status === 403 && code === 'email_not_verified') return true;
  const message = (err.response?.data?.message || '').toLowerCase();
  return status === 403 && message.includes('verify your email');
}

export function handleEmailVerificationError(err, navigate) {
  if (!isEmailVerificationError(err)) return false;
  if (navigate) navigate('/app/settings');
  return true;
}

export function handleApiLimitError(err, openLimitModal) {
  const status = err.response?.status;
  const message = err.response?.data?.message || '';
  if (status !== 402) return false;

  const lower = message.toLowerCase();
  if (lower.includes('document') || lower.includes('limit')) {
    openLimitModal({ type: 'documents', message });
    return true;
  }
  if (lower.includes('ai') || lower.includes('pro') || lower.includes('team')) {
    openLimitModal({ type: 'ai', message });
    return true;
  }
  if (lower.includes('template') || lower.includes('premium')) {
    openLimitModal({ type: 'templates', message });
    return true;
  }
  openLimitModal({ type: 'generic', message });
  return true;
}
