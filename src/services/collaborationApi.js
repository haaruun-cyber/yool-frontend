import { api } from '../utils/api';

export const collaborationApi = {
  room: (documentId) => api.get(`/collaboration/rooms/${documentId}`),
  invite: (payload) => api.post('/collaboration/invites', payload),
};
