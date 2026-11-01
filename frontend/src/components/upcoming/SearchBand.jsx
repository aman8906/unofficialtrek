import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { searchAll } from '../../services/api';
import { useDebounce } from '../../lib/hooks';

// Green band: "Looking for a specific trek?" with a live search box
export default function SearchBand() {
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [focus, setFocus] = useState(false);
  const dq = useDebounce(q, 250);
  const box = useRef(null);
  const nav = useNavigate();

  useEffect(() => {
    if (dq.trim().length < 2) { setItems([]); return; }
    searchAll(dq).then((r) => setItems(r.treks));
  }, [dq]);
  useEffect(() => {
    const h = (e) => box.current && !box.current.contains(e.target) && setFocus(false);
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const submit = (e) => { e.preventDefault(); if (items[0]) nav(`/treks/${items[0].slug}`); else if (q.trim()) nav(`/treks?q=${encodeURIComponent(q.trim())}`); };

  return (
    <section className="bg-linear-to-b from-[#07412b] via-[#1a5026] to-[#2b5c21] px-4 pb-9 pt-3 text-center">
      <h2 className="font-serif text-[26px] font-bold leading-tight text-white sm:text-[30px] lg:text-[30px]">Looking for a specific trek?</h2>
      <div ref={box} className="relative mx-auto mt-4 max-w-[640px] text-left">
        <form onSubmit={submit} role="search" className="flex items-center rounded-lg bg-white py-1.5 pl-4 pr-1.5 shadow-lg">
          <input value={q} onChange={(e) => { setQ(e.target.value); setFocus(true); }} onFocus={() => setFocus(true)} aria-label="Trek name" placeholder="Type a trek’s name here" className="min-w-0 flex-1 bg-transparent py-1.5 text-[15px] text-ink placeholder:text-[#6c757d] focus:outline-hidden" />
          <button aria-label="Search" className="grid h-9 w-10 place-items-center rounded-lg bg-searchbtn text-brand transition hover:bg-brand hover:text-white"><Search className="h-5 w-5" /></button>
        </form>
        {focus && items.length > 0 && (
          <ul className="absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-line bg-white shadow-card-hover">
            {items.map((t) => <li key={t.id}><Link to={`/treks/${t.slug}`} className="block px-4 py-2.5 text-sm hover:bg-brand-light"><span className="font-medium text-ink">{t.title} Trek</span> <span className="text-xs">{t.days} days · {t.difficulty}</span></Link></li>)}
          </ul>
        )}
      </div>
    </section>
  );
}