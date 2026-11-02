import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, CloudSun, Thermometer } from 'lucide-react';
import { getWeather, getWeatherMonths } from '../services/api';
import { useAsync } from '../lib/hooks';
import { useSettings } from '../lib/store';
import { PHOTOS } from '../data/images';
import { ImageBox, Skeleton } from '../components/ui';
import { HomeHeading } from '../components/home/primitives';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SHORT = MONTHS.map((m) => m.slice(0, 3));
const PICS = ['snow1', 'trail', 'ridge', 'snow4', 'rocks', 'peaks'];
const monthLabel = (ym) => { const [y, m] = ym.split('-'); return `${MONTHS[Number(m) - 1]} ${y}`; };
const fmt = (d = '') => `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}`;
const when = (w) => `${(w.date || '').slice(8, 10)} ${SHORT[Number((w.date || '').slice(5, 7)) - 1] || ''} ${(w.date || '').slice(0, 4)}${w.updatedAt?.includes(',') ? ` | ${w.updatedAt.split(',')[1].trim().toLowerCase()}` : ''}`;

export default function NewsPage() {
  const site = useSettings().siteName;
  const [sp, setSp] = useSearchParams();
  const { data: months, loading: lm } = useAsync(() => getWeatherMonths(), []);
  const list = months || [];
  const month = sp.get('month') && list.includes(sp.get('month')) ? sp.get('month') : list[0];
  const { data, loading } = useAsync(() => (month ? getWeather(month) : Promise.resolve([])), [month]);
  const [open, setOpen] = useState(null);
  const rows = data || [];

  const idx = list.indexOf(month);
  const newer = idx > 0 ? list[idx - 1] : null;
  const older = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
  const windowMonths = useMemo(() => (idx < 0 ? [] : list.slice(Math.max(0, idx - 1), idx + 2)), [list, idx]);
  const go = (m) => { setSp({ month: m }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const title = (w) => w.headline || `${fmt(w.date)} – ${w.condition} in ${w.basecamp} (${w.trek}) | ${(w.bullets || []).slice(0, 2).join(' | ')} | Trek News | ${site}`;

  return (
    <section className="py-10">
      <div className="mx-auto w-full max-w-[1060px] px-4 sm:px-6">
        <HomeHeading title={month ? `${monthLabel(month)} News` : 'Weather & Trek News'} right="Daily weather and trek updates from our basecamps." />
        {lm || loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-64" />)}</div>
        ) : !rows.length ? (
          <p className="rounded border border-dashed border-[#ccc] p-10 text-center text-sm">No updates for this month yet.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {rows.map((w, i) => (
              <button key={w.id} onClick={() => setOpen(w)} className="group flex flex-col overflow-hidden rounded-lg bg-white text-left shadow-[0_2px_8px_rgba(0,0,0,0.22)] transition hover:-translate-y-1">
                <ImageBox src={w.image || PHOTOS[PICS[i % PICS.length]]?.(500)} hue={200} alt="" className="h-[152px]" />
                <div className="flex-1 px-3.5 pb-3.5 pt-3">
                  <h3 className="font-serif text-[12.5px] font-bold leading-[1.45] text-black">{title(w)}</h3>
                  <p className="mt-2 font-serif text-[11px] italic text-[#666]">By {w.author || 'Trek Team'}</p>
                  <p className="font-serif text-[11px] italic text-[#666]">{when(w)}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {list.length === 1 && (
          <p className="mt-4 text-center text-xs text-[#777]">Older and newer months will appear here as more updates are added.</p>
        )}

        {list.length > 0 && (
          <nav aria-label="Months" className="mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-6">
            <button disabled={!newer} onClick={() => newer && go(newer)} className="flex items-center gap-1 font-head text-xs font-bold text-black disabled:text-[#aaa]"><ChevronLeft className="h-4 w-4" />Next</button>
            {windowMonths.map((m) => (
              <button key={m} onClick={() => go(m)} aria-current={m === month} className={`rounded px-3 py-2 font-head text-xs font-bold text-black transition ${m === month ? 'bg-ihyellow shadow-[0_2px_8px_rgba(0,0,0,0.25)]' : 'hover:bg-ihfaq'}`}>{monthLabel(m)}</button>
            ))}
            <button disabled={!older} onClick={() => older && go(older)} className="flex items-center gap-1 font-head text-xs font-bold text-black disabled:text-[#aaa]">Prev<ChevronRight className="h-4 w-4" /></button>
          </nav>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/55 p-4" onClick={() => setOpen(null)} role="dialog" aria-modal="true">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(null)} aria-label="Close" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100"><X className="h-5 w-5" /></button>
            <h3 className="pr-8 font-serif text-[17px] font-bold leading-snug text-black">{title(open)}</h3>
            <p className="mt-1 font-serif text-xs italic text-[#666]">By {open.author || 'Trek Team'} | {when(open)}</p>
            <div className="my-4 flex flex-wrap gap-5 text-sm text-black">
              <span className="flex items-center gap-1.5"><CloudSun className="h-4 w-4 text-[#c26a12]" />{open.condition}</span>
              <span className="flex items-center gap-1.5"><Thermometer className="h-4 w-4 text-[#c26a12]" />{open.min}° to {open.max}°C</span>
              <span className="font-semibold">{open.basecamp} ({open.trek})</span>
            </div>
            <ul className="space-y-2 border-t border-[#e5e5e5] pt-4 font-serif text-[14px] text-black">{(open.bullets || []).map((b, i) => <li key={i} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ihyellow" />{b}</li>)}</ul>
          </div>
        </div>
      )}
    </section>
  );
}