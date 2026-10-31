import axios from 'axios';
import * as M from '../data/mock';
import { readStore, writeStore } from '../lib/store';

// One place for every server call. While VITE_USE_MOCK=true the app runs on
// sample data (plus whatever the admin panel saved in localStorage).
// In the backend step set VITE_USE_MOCK=false and these hit Express.
export const http = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1' });
http.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('user:token');
  if (t && String(cfg.url) === '/bookings' && !cfg.headers.Authorization) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const wait = (v, ms = 250) => new Promise((r) => setTimeout(() => r(v), ms));
const get = async (url, params, mock) => (USE_MOCK ? wait(mock()) : (await http.get(url, { params })).data.data);
const post = async (url, body, mock) => (USE_MOCK ? wait(mock()) : (await http.post(url, body)).data.data);

const liveTreks = () => readStore('admin:treks', M.treks).filter((t) => t.published !== false);
const liveActivities = () => readStore('admin:activities', M.activities).filter((t) => t.published !== false);
const liveVillages = () => readStore('admin:villages', M.villages).filter((t) => t.published !== false);

export function filterTreks(list, p = {}) {
  let out = [...list];
  if (p.season) out = out.filter((t) => (t.seasons || []).includes(p.season));
  if (p.difficulty) out = out.filter((t) => t.difficulty === p.difficulty);
  if (p.q) out = out.filter((t) => `${t.title} ${t.region} ${t.shortDesc}`.toLowerCase().includes(p.q.toLowerCase()));
  if (p.maxDays) out = out.filter((t) => Number(t.days) <= Number(p.maxDays));
  if (p.days) out = out.filter((t) => Number(t.days) === Number(p.days));
  if (p.minDays) out = out.filter((t) => Number(t.days) >= Number(p.minDays));
  if (p.featured) out = out.filter((t) => t.isFeatured);
  if (p.sort === 'price-asc') out.sort((a, b) => a.price - b.price);
  if (p.sort === 'price-desc') out.sort((a, b) => b.price - a.price);
  if (p.sort === 'days') out.sort((a, b) => a.days - b.days);
  return out;
}

export const getTreks = (p = {}) => get('/treks', p, () => filterTreks(liveTreks(), p));
export const getTrek = (slug) => get(`/treks/${slug}`, {}, () => liveTreks().find((t) => t.slug === slug) || null);
export const getSeasons = () => get('/seasons', {}, () => readStore('admin:seasons', M.seasons));
export const getActivities = (type) => get('/activities', { type }, () => liveActivities().filter((a) => !type || a.type === type));
export const getVillages = () => get('/villages', {}, () => liveVillages());
export const getTestimonials = () => get('/testimonials', {}, () => readStore('admin:testimonials', M.testimonials).filter((t) => t.approved !== false));
export const getWeather = () => get('/weather', {}, () => readStore('admin:weather', M.weather));
export const getFaqs = () => get('/faqs', {}, () => readStore('admin:faqs', M.faqs));
export const getBatches = (trekTitle) => get('/batches', { trek: trekTitle }, () => readStore('admin:batches', M.sampleBatches).filter((b) => b.trek === trekTitle && b.status === 'open'));
export const getAllBatches = () => get('/batches', {}, () => readStore('admin:batches', M.sampleBatches).filter((b) => b.status === 'open'));
export const searchAll = (q) =>
  get('/search', { q }, () => {
    const s = q.toLowerCase();
    const hit = (o) => `${o.title} ${o.shortDesc || ''}`.toLowerCase().includes(s);
    return { treks: liveTreks().filter(hit).slice(0, 4), activities: liveActivities().filter(hit).slice(0, 3), villages: liveVillages().filter(hit).slice(0, 3) };
  }, 0);

const saveTo = (key, seed, row) => {
  const rows = readStore(key, seed);
  writeStore(key, [{ id: Date.now().toString(36), ...row }, ...rows]);
  return { ok: true };
};
export const postEnquiry = (d) => post('/enquiries', d, () => saveTo('admin:enquiries', M.sampleEnquiries, { ...d, replied: false }));
export const postBooking = (d) => post('/bookings', d, () => saveTo('admin:bookings', M.sampleBookings, { ...d, status: 'pending' }));
