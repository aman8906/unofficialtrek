import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { Mountain, CalendarDays, Sun, Waves, Home, Ticket, MessageSquare, CloudSun, Star, HelpCircle, Users, Gift,Circle, LayoutDashboard, Settings as SettingsIcon, LogOut, Menu, X, ExternalLink } from 'lucide-react';
import { resources } from './resources';
import { useAuth } from './auth';

const Icons = { Mountain, CalendarDays, Sun, Waves, Home, Ticket, MessageSquare, CloudSun, Star, HelpCircle, Users, Gift };
export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const item = ({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-white text-brand' : 'text-white/80 hover:bg-white/10 hover:text-white'}`;
  const Nav = (
    <nav className="space-y-1 px-3 pb-6">
      <NavLink end to="/admin" className={item} onClick={() => setOpen(false)}><LayoutDashboard className="h-4 w-4" />Dashboard</NavLink>
      {resources.map((r) => { const I = Icons[r.icon] || Circle; return <NavLink key={r.key} to={`/admin/${r.key}`} className={item} onClick={() => setOpen(false)}><I className="h-4 w-4" />{r.title}</NavLink>; })}
      <NavLink to="/admin/settings" className={item} onClick={() => setOpen(false)}><SettingsIcon className="h-4 w-4" />Site settings</NavLink>
    </nav>
  );
  return (
    <div className="min-h-screen bg-section-alt lg:flex">
      <aside className="hidden w-64 shrink-0 bg-brand-dark lg:block"><div className="sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-2.5 p-5 text-white"><span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10"><Mountain className="h-5 w-5" /></span><span className="font-heading font-bold">Unofficial Trek</span></div>{Nav}</div></aside>
      {open && <div className="fixed inset-0 z-40 lg:hidden"><div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} /><aside className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-brand-dark"><div className="flex items-center justify-between p-5 text-white"><span className="font-heading font-bold">Admin</span><button onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button></div>{Nav}</aside></div>}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-white px-4 sm:px-6">
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-line lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <Link to="/" target="_blank" className="hidden items-center gap-1.5 text-sm font-medium text-brand sm:flex"><ExternalLink className="h-4 w-4" />View website</Link>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right text-sm leading-tight"><p className="font-medium text-ink">{user?.name}</p><p className="text-xs">{user?.role}</p></div>
            <button onClick={logout} className="grid h-10 w-10 place-items-center rounded-full border border-line hover:bg-slate-50" aria-label="Log out"><LogOut className="h-4 w-4" /></button>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
