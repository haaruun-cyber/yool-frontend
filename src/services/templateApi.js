import { api } from '../utils/api';

export const templateApi = {
  list: (params) => api.get('/templates', { params }),
  get: (id) => api.get(`/templates/${id}`),
  use: (id) => api.post(`/templates/${id}/use`),
};
