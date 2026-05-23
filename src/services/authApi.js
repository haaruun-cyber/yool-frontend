import { api } from '../utils/api';

export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  logout: (refreshToken) => api.post('/auth/logout', refreshToken ? { refreshToken } : {}),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email: email.trim() }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  sendVerification: () => api.post('/auth/send-verification'),
  googleStatus: () => api.get('/auth/google/status'),
  googleLogin: async () => {
    const apiRoot = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');
    try {
      const { data } = await authApi.googleStatus();
      if (data.startUrl) {
        window.location.href = data.startUrl;
        return;
      }
    } catch {
      /* fallback below */
    }
    window.location.href = `${apiRoot || window.location.origin}/api/auth/google`;
  },
};

export const userApi = {
  me: () => api.get('/users/me'),
  usage: () => api.get('/users/me/usage'),
  updateMe: (payload) => api.patch('/users/me', payload),
  uploadAvatar: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post('/users/me/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};
