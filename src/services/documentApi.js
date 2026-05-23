import { api } from '../utils/api';

export const documentApi = {
  list: (params) => api.get('/documents', { params }),
  get: (id) => api.get(`/documents/${id}`),
  create: (payload) => api.post('/documents', payload),
  update: (id, payload) => api.patch(`/documents/${id}`, payload),
  remove: (id) => api.delete(`/documents/${id}`),
  duplicate: (id) => api.post(`/documents/${id}/duplicate`),
  archive: (id) => api.post(`/documents/${id}/archive`),
  restore: (id) => api.post(`/documents/${id}/restore`),
  pin: (id, isPinned) => api.patch(`/documents/${id}/pin`, { isPinned }),
  favorite: (id, isFavorite) => api.patch(`/documents/${id}/favorite`, { isFavorite }),
  versions: (id) => api.get(`/documents/${id}/versions`),
  revert: (id, versionId) => api.post(`/documents/${id}/versions/${versionId}/revert`),
  share: (id, payload) => api.post(`/documents/${id}/share`, payload),
  updateShare: (id, userId, permission) => api.patch(`/documents/${id}/share/${userId}`, { permission }),
  revokeShare: (id, userId) => api.delete(`/documents/${id}/share/${userId}`),
  revokePending: (id, email) => api.delete(`/documents/${id}/pending/${encodeURIComponent(email)}`),
  uploadCover: (id, file) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post(`/documents/${id}/cover`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export const searchApi = {
  search: (q, params) => api.get('/search', { params: { q, ...params } }),
};
