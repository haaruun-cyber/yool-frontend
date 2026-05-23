import { api } from '../utils/api';

export const paymentApi = {
  plans: () => api.get('/payments/plans'),
  checkout: (payload) => api.post('/payments/checkout', payload),
  portal: () => api.post('/payments/portal'),
};
