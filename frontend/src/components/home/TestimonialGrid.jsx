import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getTestimonials } from '../../services/api';
import { useAsync } from '../../lib/hooks';
import { Skeleton } from '../ui';
import { HomeHeading } from './primitives';

const PER = 4;
const COLORS = ['#3a652d', '#1b457c', '#b54a00', '#6b2d7b', '#00796b'];

// 1 2 3 ... 18 style page list
function pageList(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, 2, page - 1, page, page + 1, total - 1, total]);
  const arr = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  return arr.flatMap((p, k) => (k && p - arr[k - 1] > 1 ? ['…', p] : [p]));
}

export default function TestimonialGrid() {
  const { data, loading } = useAsync(() => getTestimonials(), []);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(null);
  const list = data || [];
  const pages = Math.max(1, Math.ceil(list.length / PER));
  const view = list.slice((page - 1) * PER, page * PER);
  const go = (p) => setPage(Math.min(pages, Math.max(1, p)));

  return (
    <section className="py-10 sm:py-14">
      <div className="container">
        <HomeHeading title="Read Why Trekkers Love Our Transformative Treks" />
        {loading ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-64" />)}</div> : !list.length ? (
          <p className="py-8 text-center text-sm">Trekker stories will appear here soon.</p>
        ) : (
          <>
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {view.map((t, k) => (
                <article key={t.id} className="px-1 sm:px-3">
                  <div className="flex items-center gap-2.5 border-b border-[#d8d8d8] pb-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full font-head text-base font-bold text-white" style={{ background: COLORS[(page * PER + k) % COLORS.length] }}>{t.name?.[0]}</span>
                    <div className="min-w-0">
                      <p className="font-head text-[11.5px] font-bold uppercase tracking-wide text-[#696969]">{t.name}</p>
                      <p className="text-[11px] leading-tight text-black">{t.designation}</p>
                    </div>
                  </div>
                  <h3 className="mt-4 font-serif text-[15px] font-bold leading-snug text-black">{t.headline}</h3>
                  <p className="mt-2 line-clamp-5 font-sans text-[13px] leading-snug text-black">{t.excerpt}</p>
                  <button onClick={() => setOpen(t)} className="mt-1 text-[12.5px] text-[#2200cc] underline">Read More</button>
                </article>
              ))}
            </div>
            {pages > 1 && (
              <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-3">
                <button onClick={() => go(page - 1)} disabled={page === 1} className="flex items-center gap-1 px-2 font-head text-xs font-semibold text-black disabled:opacity-40"><ChevronLeft className="h-4 w-4" />Previous</button>
                {pageList(page, pages).map((p, k) => p === '…'
                  ? <span key={`e${k}`} className="px-1 text-xs text-[#aaa]">…</span>
                  : <button key={p} onClick={() => go(p)} aria-current={p === page} className={`h-7 min-w-7 rounded px-2 font-head text-xs font-bold text-black transition ${p === page ? 'bg-ihyellow shadow-[0_2px_6px_rgba(0,0,0,0.25)]' : 'hover:bg-ihfaq'}`}>{p}</button>)}
                <button onClick={() => go(page + 1)} disabled={page === pages} className="flex items-center gap-1 px-2 font-head text-xs font-semibold text-black disabled:opacity-40">Next<ChevronRight className="h-4 w-4" /></button>
              </nav>
            )}
          </>
        )}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setOpen(null)}>
          <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(null)} aria-label="Close" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100"><X className="h-5 w-5" /></button>
            <h3 className="pr-8 font-serif text-lg font-bold text-black">{open.headline}</h3>
            <p className="mt-1 text-sm">{open.name}, {open.designation}</p>
            <p className="mt-4 text-[14px] leading-relaxed text-black">{open.excerpt}</p>
          </div>
        </div>
      )}
    </section>
  );
}