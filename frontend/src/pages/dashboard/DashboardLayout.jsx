import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Lightbulb, X } from 'lucide-react';
import { Logo } from '../../components/Header';
import { useUserAuth } from '../../user/UserAuth';

const LINKS = [['Upcoming treks', 'user-upcoming'], ['My wishlist', 'user-wishlist'], ['Previous treks', 'user-previous'], ['My details', 'user-myprofile'], ['Trek vouchers', 'user-vouchers']];

// "Hi Name (email)" heading used on every dashboard page
export function DashHeading({ sub }) {
  const { user } = useUserAuth();
  return (
    <div className="mb-8">
      <h1 className="font-dash text-[20px] font-bold leading-snug text-black sm:text-[22px] lg:text-[22px]">Hi {user.name} ({user.email})</h1>
      <p className="mt-1 font-dash text-[14px] text-black">{sub}</p>
    </div>
  );
}
export const SectionTitle = ({ children }) => (
  <h2 className="mb-5 inline-block border-b-[3px] border-dashyellow pb-0.5 font-dash text-[17px] font-bold leading-snug text-black sm:text-[17px] lg:text-[17px]">{children}</h2>
);

function SuggestionModal({ onClose }) {
  const { suggest } = useUserAuth();
  const [text, setText] = useState('');
  const [state, setState] = useState({ busy: false, ok: '', err: '' });
  const send = async (e) => {
    e.preventDefault();
    setState({ busy: true, ok: '', err: '' });
    try { setState({ busy: false, ok: await suggest(text), err: '' }); setText(''); } catch (er) { setState({ busy: false, ok: '', err: er.message }); }
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <form onSubmit={send} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3"><X className="h-5 w-5" /></button>
        <h3 className="font-dash text-lg">Share a suggestion</h3>
        <p className="mb-3 mt-1 text-sm">Tell us what would make this site better for you.</p>
        <textarea required minLength={5} maxLength={1000} rows={5} value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-lg bg-dashfield p-3 text-sm outline-none focus:ring-1 focus:ring-dashgreen" />
        {state.err && <p role="alert" className="mt-2 text-sm text-red-600">{state.err}</p>}
        {state.ok && <p role="status" className="mt-2 text-sm text-green-700">{state.ok}</p>}
        <button className="mt-4 h-9 rounded bg-dashgreen px-6 text-sm font-semibold text-white disabled:opacity-60" disabled={state.busy}>{state.busy ? 'Sending...' : 'Send'}</button>
      </form>
    </div>
  );
}

export default function DashboardLayout() {
  const { logout } = useUserAuth();
  const [suggest, setSuggest] = useState(false);
  const item = ({ isActive }) => `block py-1.5 text-[11px] font-semibold uppercase tracking-wide transition hover:text-black ${isActive ? 'text-black underline underline-offset-4' : 'text-dashlink'}`;
  return (
    <div className="min-h-screen bg-white font-auth">
      <header className="border-b border-[#b7b7b7] bg-white">
        <div className="mx-auto flex max-w-[1250px] items-center justify-between px-4 py-4 sm:px-8">
          <Logo />
          <Link to="/" className="text-sm text-dashlink hover:underline">&larr; Back to website</Link>
        </div>
      </header>
      <div className="bg-dashbg">
        <div className="mx-auto grid max-w-[1250px] lg:grid-cols-[1fr_270px]">
          <main className="min-w-0 px-4 py-8 sm:px-10 lg:px-16"><Outlet /></main>
          <aside className="order-first bg-white lg:order-last">
            <div className="bg-dashyellow px-4 py-3"><p className="font-dash text-[15px] font-bold text-black">Trekker Dashboard</p></div>
            <nav aria-label="Dashboard" className="flex flex-wrap gap-x-5 px-4 py-3 lg:block lg:px-6 lg:py-5">
              {LINKS.map(([label, to]) => <NavLink key={to} to={`/user-dashboard/${to}`} className={item}>{label}</NavLink>)}
              <button onClick={logout} className="block py-1.5 text-[11px] font-semibold uppercase tracking-wide text-dashlink hover:text-black">Logout</button>
            </nav>
            <div className="mx-4 mb-6 rounded-lg border border-[#e5e7eb] p-4 shadow-sm lg:mx-6">
              <p className="flex items-start gap-2 text-[13px] font-semibold text-black"><Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-dashyellow" />Have A Feature In Mind?</p>
              <p className="mb-3 mt-1 text-[11px] text-dashlink">We are always improving. If there is a feature you would love to see, let us know.</p>
              <button onClick={() => setSuggest(true)} className="rounded bg-[#ffcc00] px-3 py-1 text-[11px] font-semibold text-[#111827] hover:brightness-95">Share a Suggestion &rsaquo;</button>
            </div>
          </aside>
        </div>
      </div>
      {suggest && <SuggestionModal onClose={() => setSuggest(false)} />}
    </div>
  );
}