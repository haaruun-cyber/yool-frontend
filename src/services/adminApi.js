import { api } from '../utils/api';

export const adminApi = {
  users: () => api.get('/admin/users'),
  blockUser: (id, isBlocked) => api.patch(`/admin/users/${id}/block`, { isBlocked }),
  subscriptions: () => api.get('/admin/subscriptions'),
  analytics: () => api.get('/admin/analytics'),
  createTemplate: (payload) => api.post('/admin/templates', payload),
  updateTemplate: (id, payload) => api.patch(`/admin/templates/${id}`, payload),
  deleteTemplate: (id) => api.delete(`/admin/templates/${id}`),
};
