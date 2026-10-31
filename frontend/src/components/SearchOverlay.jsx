import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Mountain, Waves, Home } from 'lucide-react';
import { searchAll } from '../services/api';
import { useDebounce } from '../lib/hooks';

export default function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState('');
  const [res, setRes] = useState(null);
  const dq = useDebounce(q, 300);
  const ref = useRef(null);
  const nav = useNavigate();

  useEffect(() => {
    if (open) { setTimeout(() => ref.current?.focus(), 50); document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; setQ(''); setRes(null); }
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  useEffect(() => {
    if (dq.trim().length < 2) { setRes(null); return; }
    searchAll(dq).then(setRes);
  }, [dq]);

  if (!open) return null;
  const go = (path) => { onClose(); nav(path); };
  const submit = (e) => { e.preventDefault(); if (q.trim()) go(`/treks?q=${encodeURIComponent(q.trim())}`); };
  const empty = res && !res.treks.length && !res.activities.length && !res.villages.length;

  const Row = ({ icon: Icon, label, sub, path }) => (
    <button onClick={() => go(path)} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-brand-light">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-light text-brand"><Icon className="h-4 w-4" /></span>
      <span><span className="block font-medium text-ink">{label}</span><span className="block text-xs">{sub}</span></span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-xs" onClick={onClose} role="dialog" aria-modal="true" aria-label="Search">
      <div className="mx-auto mt-0 w-full max-w-3xl rounded-b-card bg-white p-4 shadow-card-hover sm:mt-16 sm:rounded-card sm:p-6" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={submit} className="flex items-center gap-3">
          <Search className="h-5 w-5 text-brand" />
          <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search treks, rafting, villages in Uttarakhand" className="w-full border-0 bg-transparent py-2 text-base text-ink placeholder:text-body/60 focus:outline-hidden" />
          <button type="button" onClick={onClose} aria-label="Close search" className="grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </form>
        <div className="mt-3 max-h-[60vh] overflow-y-auto border-t border-line pt-3">
          {!res && <p className="px-3 py-4 text-sm">Type at least 2 letters. Try “Kedar”, “rafting” or “Kotgaon”.</p>}
          {empty && <p className="px-3 py-4 text-sm">No match for “{dq}”. Try a trek name or a season.</p>}
          {res?.treks.map((t) => <Row key={t.id} icon={Mountain} label={t.title} sub={`${t.days} days · ${t.difficulty}`} path={`/treks/${t.slug}`} />)}
          {res?.activities.map((a) => <Row key={a.id} icon={Waves} label={a.title} sub={a.location} path={a.type === 'bungee' ? '/bungee-jumping' : '/rafting'} />)}
          {res?.villages.map((v) => <Row key={v.id} icon={Home} label={v.title} sub={v.district} path="/villages" />)}
        </div>
      </div>
    </div>
  );
}
