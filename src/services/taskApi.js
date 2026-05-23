import { api } from '../utils/api';

export const taskApi = {
  byDocument: (documentId) => api.get(`/tasks/document/${documentId}`),
  create: (payload) => api.post('/tasks', payload),
  update: (id, payload) => api.patch(`/tasks/${id}`, payload),
  remove: (id) => api.delete(`/tasks/${id}`),
  complete: (id) => api.post(`/tasks/${id}/complete`),
  deadline: (id, dueDate) => api.patch(`/tasks/${id}/deadline`, { dueDate }),
};
