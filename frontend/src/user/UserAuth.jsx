import { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { http, USE_MOCK } from '../services/api';
import { errMsg } from '../services/adminApi';
import { readStore, writeStore } from '../lib/store';

// Customer accounts (separate from the admin panel login).
const TOKEN = 'user:token';
const SESSION = 'user:session';
export const DASHBOARD = '/user-dashboard/user-myprofile';
// after login / register: go back to where the person came from, otherwise open the dashboard
export const afterLogin = (from) => (!from || from === '/' ? DASHBOARD : from);

const Ctx = createContext(null);
export const useUserAuth = () => useContext(Ctx);
const authed = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN)}` } });

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(() => readStore(SESSION, null));
  const [wish, setWish] = useState([]); // wishlist treks
  const [loading, setLoading] = useState(() => !USE_MOCK && !!localStorage.getItem(TOKEN));

  const loadWish = () => http.get('/auth/wishlist', authed()).then((r) => setWish(r.data.data)).catch(() => {});
  const save = (d) => { localStorage.setItem(TOKEN, d.token); writeStore(SESSION, d.user); setUser(d.user); loadWish(); return d.user; };
  const logout = () => { localStorage.removeItem(TOKEN); localStorage.removeItem(SESSION); setUser(null); setWish([]); };
  // every call throws an Error with a readable message
  const call = async (fn) => {
    if (USE_MOCK) throw new Error('Login needs the backend. Set VITE_USE_MOCK=false in the frontend .env and start the backend.');
    try { return await fn(); } catch (e) { throw new Error(errMsg(e)); }
  };

  const api = {
    login: (email, password) => call(async () => save((await http.post('/auth/login', { email, password })).data.data)),
    register: (form) => call(async () => save((await http.post('/auth/register', form)).data.data)),
    google: (credential) => call(async () => save((await http.post('/auth/google', { credential })).data.data)),
    forgot: (email) => call(async () => (await http.post('/auth/forgot-password', { email })).data.message),
    reset: (token, password) => call(async () => (await http.post('/auth/reset-password', { token, password })).data.message),
    updateProfile: (body) => call(async () => { const u = (await http.put('/auth/me', body, authed())).data.data; writeStore(SESSION, u); setUser(u); return u; }),
    myBookings: () => call(async () => (await http.get('/auth/my-bookings', authed())).data.data),
    vouchers: () => call(async () => (await http.get('/auth/vouchers', authed())).data.data),
    suggest: (message) => call(async () => (await http.post('/auth/suggestions', { message }, authed())).data.message),
    // add or remove a trek from the wishlist
    toggleWish: (trekId) => call(async () => {
      const has = wish.some((t) => t.id === trekId);
      const r = has ? await http.delete(`/auth/wishlist/${trekId}`, authed()) : await http.post('/auth/wishlist', { trekId }, authed());
      setWish(r.data.data);
    }),
  };

  // check the saved token once when the site opens
  useEffect(() => {
    if (USE_MOCK || !localStorage.getItem(TOKEN)) { setLoading(false); return; }
    http.get('/auth/me', authed())
      .then((r) => { writeStore(SESSION, r.data.data); setUser(r.data.data); loadWish(); })
      .catch((e) => { if (e.response?.status === 401) logout(); })
      .finally(() => setLoading(false));
  }, []);

  return <Ctx.Provider value={{ user, loading, wish, logout, ...api }}>{children}</Ctx.Provider>;
}

export function RequireUser({ children }) {
  const { user, loading } = useUserAuth();
  const loc = useLocation();
  if (loading) return <div className="grid min-h-[50vh] place-items-center text-sm">Loading...</div>;
  return user ? children : <Navigate to="/login" state={{ from: loc.pathname }} replace />;
}