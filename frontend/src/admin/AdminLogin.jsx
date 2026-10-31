import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Mountain } from 'lucide-react';
import { useAuth } from './auth';
import { USE_MOCK } from '../services/api';

export default function AdminLogin() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState(USE_MOCK ? 'admin@unofficialtrek.com' : '');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/admin" replace />;
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    const r = await login(email, pw);
    setBusy(false);
    r === true ? nav('/admin') : setErr(r);
  };
  return (
    <div className="grid min-h-screen place-items-center bg-section-alt p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-card bg-white p-6 shadow-card sm:p-8">
        <div className="mb-6 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-white"><Mountain className="h-5 w-5" /></span><div><h1 className="text-xl sm:text-2xl lg:text-2xl">Admin login</h1><p className="text-sm">Unofficial Trek</p></div></div>
        <label className="label" htmlFor="e">Email</label><input id="e" type="email" className="input mb-4" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="label" htmlFor="p">Password</label><input id="p" type="password" className="input" value={pw} onChange={(e) => setPw(e.target.value)} />
        {err && <p role="alert" className="mt-3 text-sm text-red-600">{err}</p>}
        <button className="btn-primary mt-6 w-full" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button>
        {USE_MOCK && <p className="mt-4 rounded-lg bg-section-alt p-3 text-xs">Demo mode login: admin@unofficialtrek.com / admin123. Set VITE_USE_MOCK=false to use the real backend.</p>}
      </form>
    </div>
  );
}
