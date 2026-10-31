import { createContext, useContext, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { readStore, writeStore } from '../lib/store';
import { http, USE_MOCK } from '../services/api';
import { errMsg } from '../services/adminApi';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStore('admin:session', null));

  // returns true on success, or an error message string
  const login = async (email, password) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      if (email === 'admin@unofficialtrek.com' && password === 'admin123') {
        const u = { name: 'Site Owner', email, role: 'super_admin' };
        writeStore('admin:session', u); setUser(u); return true;
      }
      return 'Email or password is wrong.';
    }
    try {
  const { data } = await http.post('/auth/login', { email, password });
  if (data.data.user.role === 'customer') return 'This is a customer account. The admin panel is for staff only.';
  localStorage.setItem('admin:token', data.data.token);
  writeStore('admin:session', data.data.user);
  setUser(data.data.user);
  return true;
} catch (e) { return errMsg(e); }
};
  const logout = () => { localStorage.removeItem('admin:session'); localStorage.removeItem('admin:token'); setUser(null); };
  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

export function RequireAuth({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  return user ? children : <Navigate to="/admin/login" state={{ from: loc.pathname }} replace />;
}
