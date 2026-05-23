import { api } from '../utils/api';

export const aiApi = {
  summarize: (text) => api.post('/ai/summarize', { text }),
  meetingSummary: (text) => api.post('/ai/meeting-summary', { text }),
  generateTasks: (text) => api.post('/ai/generate-tasks', { text }),
  write: (instruction, draft) => api.post('/ai/write', { instruction, draft }),
};
