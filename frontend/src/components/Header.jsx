import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Megaphone, X } from 'lucide-react';
import { seasons } from '../data/mock';
import { useSettings } from '../lib/store';
import { searchAll } from '../services/api';
import { useDebounce } from '../lib/hooks';
import SearchOverlay from './SearchOverlay';
import { useUserAuth } from '../user/UserAuth';

// ---- Edit menu content here (labels and links) ----------------------------
const UTILITY = [['Contact us', '/contact'], ['Book now', '/treks']];
const DIFFICULTY = ['Easy-Moderate', 'Moderate', 'Difficult'];
const YELLOW_NAV = [
  { label: 'Upcoming treks', to: '/upcoming' },
  { label: 'Treks by season', to: '/treks', menu: 'seasons' },
  { label: 'Village Culture Treks & Experience', to: '/villages' },
  { label: 'Rafting', to: '/rafting' },
  { label: 'Bungee jumping', to: '/bungee-jumping' },
  { label: 'Weather updates', to: '/weather' },
  { label: 'Our story', to: '/about' },
];
// ---------------------------------------------------------------------------

export const Logo = ({ light = false }) => {
  const s = useSettings();
  return (
    <Link to="/" className="inline-flex flex-col leading-none" aria-label={s.siteName}>
      <span className="font-heading text-[26px] font-bold tracking-tight sm:text-[30px]">
        <span className={light ? 'text-white' : 'text-[#050708]'}>Unofficial</span><span className="text-logoyellow">trek</span>
      </span>
      <span className={`mt-1.5 text-[8.5px] font-semibold tracking-[0.2em] sm:text-[9.5px] ${light ? 'text-white/80' : 'text-ink'}`}>TREKS OF UTTARAKHAND</span>
    </Link>
  );
};

function MenuToggle({ open, onClick }) {
  return (
    <button onClick={onClick} aria-label="Toggle menu" aria-expanded={open} className="relative grid h-11 w-11 place-items-center rounded-full border border-line bg-white xl:hidden">
      <span className="relative block h-4 w-5">
        <span className={`absolute left-0 h-0.5 w-5 rounded bg-ink transition-all duration-300 ${open ? 'top-[7px] rotate-45' : 'top-0'}`} />
        <span className={`absolute left-0 top-[7px] h-0.5 w-5 rounded bg-ink transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
        <span className={`absolute left-0 h-0.5 w-5 rounded bg-ink transition-all duration-300 ${open ? 'top-[7px] -rotate-45' : 'top-[14px]'}`} />
      </span>
    </button>
  );
}

function TopBar() {
  const s = useSettings();
  const [closed, setClosed] = useState(() => sessionStorage.getItem('topbar:closed') === '1');
  if (closed || !s.banner) return null;
  const close = () => { sessionStorage.setItem('topbar:closed', '1'); setClosed(true); };
  return (
    <div className="bg-topbar text-white">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2.5 sm:px-6">
        <Megaphone className="h-5 w-5 shrink-0 text-navbar" aria-hidden="true" />
        <p className="min-w-0 flex-1 text-xs leading-snug sm:text-sm">{s.banner}</p>
        {s.bannerLinkText && (
          <Link to={s.bannerLink || '/treks'} className="shrink-0 whitespace-nowrap rounded-full border border-white/30 bg-topbtn px-3 py-1.5 text-xs font-medium transition hover:bg-white hover:text-topbar sm:px-5 sm:py-2 sm:text-sm">{s.bannerLinkText}</Link>
        )}
        <span className="hidden h-8 w-px bg-white/30 sm:block" aria-hidden="true" />
        <button onClick={close} aria-label="Close announcement" className="grid h-8 w-8 shrink-0 place-items-center rounded-full transition hover:bg-white/15"><X className="h-5 w-5" /></button>
      </div>
    </div>
  );
}

// Hover / keyboard dropdown used by "ALL TREKS" and the yellow bar.
function Dropdown({ trigger, children, panelClass = 'w-72' }) {
  return (
    <div className="group relative">
      {trigger}
      <div className={`invisible absolute left-0 top-full z-50 translate-y-1 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${panelClass}`}>
        <div className="rounded-b-card border border-line bg-white p-2 shadow-card-hover">{children}</div>
      </div>
    </div>
  );
}

function SearchBox() {
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [focus, setFocus] = useState(false);
  const dq = useDebounce(q, 300);
  const ref = useRef(null);
  const nav = useNavigate();

  useEffect(() => {
    if (dq.trim().length < 2) { setItems([]); return; }
    searchAll(dq).then((r) => setItems([
      ...r.treks.map((t) => ({ id: t.id, label: t.title, sub: `Trek · ${t.days} days`, to: `/treks/${t.slug}` })),
      ...r.activities.map((a) => ({ id: a.id, label: a.title, sub: a.type === 'bungee' ? 'Bungee jumping' : 'Rafting', to: a.type === 'bungee' ? '/bungee-jumping' : '/rafting' })),
      ...r.villages.map((v) => ({ id: v.id, label: v.title, sub: 'Village', to: '/villages' })),
    ]));
  }, [dq]);
  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && setFocus(false);
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const submit = (e) => { e.preventDefault(); if (q.trim()) { setFocus(false); nav(`/treks?q=${encodeURIComponent(q.trim())}`); } };
  return (
    <div ref={ref} className="relative w-[320px] 2xl:w-[400px]">
      <form onSubmit={submit} role="search" className="flex items-center rounded-xl border border-line bg-white py-1.5 pl-4 pr-1.5 shadow-xs focus-within:border-brand">
        <input value={q} onChange={(e) => { setQ(e.target.value); setFocus(true); }} onFocus={() => setFocus(true)} aria-label="Search treks" placeholder="Search treks by name, region, difficulty etc" className="min-w-0 flex-1 bg-transparent text-xs text-ink placeholder:text-body/70 focus:outline-hidden" />
        <button aria-label="Search" className="grid h-10 w-11 place-items-center rounded-lg bg-searchbtn text-brand transition hover:bg-brand hover:text-white"><Search className="h-5 w-5" /></button>
      </form>
      {focus && items.length > 0 && (
        <ul className="absolute inset-x-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-card border border-line bg-white p-2 shadow-card-hover">
          {items.map((it) => (
            <li key={it.id}><Link to={it.to} onClick={() => setFocus(false)} className="block rounded-lg px-3 py-2 hover:bg-brand-light"><span className="block text-sm font-medium text-ink">{it.label}</span><span className="text-xs">{it.sub}</span></Link></li>
          ))}
        </ul>
      )}
    </div>
  );
}

const yellowItem = ({ isActive }) => `inline-flex items-center gap-1.5 whitespace-nowrap border-b-4 px-3 py-3.5 font-cond text-[14.5px] font-medium uppercase text-ink transition hover:bg-black/5 2xl:px-4 2xl:text-[15px] ${isActive ? 'border-ink' : 'border-transparent'}`;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mTreks, setMTreks] = useState(false);
  const [search, setSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();
  const { user } = useUserAuth();
  const quick = [...UTILITY, user ? ['My profile', '/profile'] : ['Login / Register', '/login']];

  useEffect(() => { setOpen(false); }, [loc.pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);

  return (
    <>
      <TopBar />
      <header className={`sticky top-0 z-40 bg-white ${scrolled ? 'shadow-card' : ''}`}>
        {/* white row */}
        <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-6 xl:h-[84px]">
          <Logo />
          <div className="hidden items-center gap-7 xl:flex">
            <nav aria-label="Quick links" className="flex items-center gap-6">
              {quick.map(([label, to]) => <Link key={label} to={to} className="font-cond text-[13.5px] font-medium uppercase leading-tight text-ink transition hover:text-brand">{label}</Link>)}
            </nav>
            <Dropdown panelClass="w-[460px]" trigger={
              <button className="inline-flex items-center gap-1.5 py-3 font-cond text-[13.5px] font-medium uppercase text-ink hover:text-brand">All treks <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" /></button>}>
              <div className="grid grid-cols-2 gap-2 p-2">
                <div><p className="px-3 pb-1 text-xs font-semibold text-body">By season</p>
                  {seasons.map((x) => <Link key={x.id} to={`/treks/season/${x.id}`} className="block rounded-lg px-3 py-2 hover:bg-brand-light"><span className="block text-sm font-medium text-ink">{x.label}</span><span className="text-xs">{x.months}</span></Link>)}</div>
                <div><p className="px-3 pb-1 text-xs font-semibold text-body">By difficulty</p>
                  {DIFFICULTY.map((d) => <Link key={d} to={`/treks?difficulty=${d}`} className="block rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-brand-light">{d}</Link>)}
                  <Link to="/treks" className="mt-2 block rounded-lg bg-brand px-3 py-2 text-center text-sm font-semibold text-white">View all treks</Link></div>
              </div>
            </Dropdown>
            <SearchBox />
          </div>
          <div className="flex items-center gap-2 xl:hidden">
            <button onClick={() => setSearch(true)} aria-label="Search" className="grid h-11 w-11 place-items-center rounded-full bg-searchbtn text-brand"><Search className="h-5 w-5" /></button>
            <MenuToggle open={open} onClick={() => setOpen(!open)} />
          </div>
        </div>

        {/* yellow menu bar (desktop) */}
        <nav aria-label="Main" className="hidden bg-navbar xl:block">
          <div className="mx-auto flex max-w-[1400px] items-stretch justify-between px-2 sm:px-6">
            {YELLOW_NAV.map((it) => it.menu ? (
              <Dropdown key={it.label} trigger={<NavLink to={it.to} className={(a) => `${yellowItem(a)} h-full`}>{it.label} <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" /></NavLink>}>
                {seasons.map((x) => <Link key={x.id} to={`/treks/season/${x.id}`} className="block rounded-lg px-3 py-2.5 hover:bg-brand-light"><span className="block font-medium text-ink">{x.label}</span><span className="text-xs">{x.months}</span></Link>)}
                <Link to="/treks" className="mt-1 block rounded-lg bg-brand-light px-3 py-2.5 text-sm font-semibold text-brand">All treks</Link>
              </Dropdown>
            ) : <NavLink key={it.label} to={it.to} className={yellowItem}>{it.label}</NavLink>)}
          </div>
        </nav>
      </header>

      {/* mobile / tablet drawer */}
      <div className={`fixed inset-0 z-30 xl:hidden ${open ? '' : 'pointer-events-none'}`}>
        <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} />
        <aside className={`absolute right-0 top-0 h-full w-[86%] max-w-sm overflow-y-auto bg-white pt-32 shadow-card-hover transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <nav className="flex flex-col px-5 pb-10" aria-label="Mobile">
            <Link to="/upcoming" className="border-b border-line py-4 font-heading text-base font-semibold uppercase text-ink">Upcoming treks</Link>
            <button onClick={() => setMTreks(!mTreks)} aria-expanded={mTreks} className="flex items-center justify-between border-b border-line py-4 text-left font-heading text-base font-semibold uppercase text-ink">
              Treks by season <ChevronDown className={`h-5 w-5 transition ${mTreks ? 'rotate-180' : ''}`} />
            </button>
            {mTreks && (
              <div className="border-b border-line bg-navbar/20 py-2 pl-3">
                {seasons.map((x) => <Link key={x.id} to={`/treks/season/${x.id}`} className="block py-2.5"><span className="font-medium text-ink">{x.label}</span> <span className="text-xs">({x.months})</span></Link>)}
                <Link to="/treks" className="block py-2.5 font-semibold text-brand">All treks</Link>
              </div>
            )}
            {[['/villages', 'Village Culture Treks & Experience'], ['/rafting', 'Rafting'], ['/bungee-jumping', 'Bungee jumping'], ['/weather', 'Weather updates'], ['/about', 'Our story'], ...quick.map(([l, t]) => [t, l])].map(([to, label]) => (
              <Link key={label} to={to} className="border-b border-line py-4 font-heading text-base font-semibold uppercase text-ink">{label}</Link>
            ))}
            <Link to="/contact" className="btn-primary mt-6">Enquire now</Link>
          </nav>
        </aside>
      </div>
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  );
}