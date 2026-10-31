import { http } from './api';

// Sends the admin JWT with every request and sends you to login if it expires.
http.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('admin:token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
http.interceptors.request.use((cfg) => {
  if (String(cfg.url).startsWith('/admin')) {
    const t = localStorage.getItem('admin:token');
    if (t) cfg.headers.Authorization = `Bearer ${t}`;
  }
  return cfg;
});

export const errMsg = (e) =>
  e?.response?.data?.details?.map((d) => `${d.field}: ${d.message}`).join(', ') ||
  e?.response?.data?.message ||
  (e?.code === 'ERR_NETWORK' ? 'Cannot reach the server. Is the backend running?' : e?.message) ||
  'Something went wrong.';

const d = (p) => p.then((r) => r.data);
export const adminApi = {
  list: (res, q) => d(http.get(`/admin/${res}`, { params: q ? { q } : {} })).then((r) => r.data),
  create: (res, body) => d(http.post(`/admin/${res}`, body)),
  update: (res, id, body) => d(http.put(`/admin/${res}/${id}`, body)).then((r) => r.data),
  remove: (res, id) => d(http.delete(`/admin/${res}/${id}`)),
  dashboard: () => d(http.get('/admin/dashboard')).then((r) => r.data),
  getSettings: () => d(http.get('/admin/settings')).then((r) => r.data),
  saveSettings: (body) => d(http.put('/admin/settings', body)).then((r) => r.data),
  upload: (file) => { const f = new FormData(); f.append('image', file); return d(http.post('/admin/upload', f)).then((r) => r.data.url); },
};
