import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { seasons } from '../../data/mock';
import { getTreks } from '../../services/api';
import { useAsync } from '../../lib/hooks';
import { trekImage } from '../../data/images';
import { ImageBox, Skeleton } from '../ui';
import { HomeHeading, WishHeart } from './primitives';

function Dot() { return <span className="mx-1.5 inline-block h-1 w-1 bg-ihyellow align-middle" />; }

function TrekTile({ t }) {
  return (
    <article className="flex h-full w-[262px] shrink-0 snap-start flex-col overflow-hidden rounded bg-white shadow-[0_1px_5px_rgba(0,0,0,0.25)]">
      <ImageBox src={trekImage(t, 600)} hue={t.hue} alt={t.title} className="h-[122px]">
        {t.badge && (
          <span className={`absolute -left-1 -top-1 grid h-[52px] w-[52px] -rotate-[18deg] place-items-center rounded-full p-1 text-center font-head text-[9px] font-extrabold leading-[1.05] tracking-wide ${/founder/i.test(t.badge) ? 'bg-[#003099] text-white' : 'bg-[#ffcc00] text-black'}`}>{t.badge}</span>
        )}
        <WishHeart trekId={t.id} className="absolute right-2 top-2" />
      </ImageBox>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
        <p className="text-[10.5px] text-[#555]">{t.days} Days<Dot />{t.difficulty}<Dot />{Number(t.altitude).toLocaleString('en-IN')} ft</p>
        <h3 className="mt-3 font-head text-[13.5px] font-bold uppercase leading-tight text-[#222]">{t.title} Trek</h3>
        <p className="mt-1.5 line-clamp-2 min-h-[2.6em] font-serif text-[13.5px] leading-snug text-black">{t.shortDesc}</p>
        <div className="mt-auto flex gap-2 pt-2.5">
          <Link to={`/treks/${t.slug}`} className="rounded-sm bg-ihgreen px-3 py-1.5 font-head text-[10.5px] font-bold text-white hover:brightness-110">Get Trek Info</Link>
          <Link to={`/upcoming?trek=${encodeURIComponent(t.title)}`} className="rounded-sm bg-ihyellow px-3 py-1.5 font-head text-[10.5px] font-bold text-black hover:brightness-95">View Dates</Link>
        </div>
      </div>
    </article>
  );
}

export default function SeasonTreks() {
  const [season, setSeason] = useState('winter');
  const cur = seasons.find((s) => s.id === season);
  const { data, loading } = useAsync(() => getTreks({ season }), [season]);
  const track = useRef(null);
  const slide = (d) => track.current?.scrollBy({ left: d * 282, behavior: 'smooth' });

  return (
    <section className="py-10 sm:py-14">
      <div className="container">
        <HomeHeading title={`Top Treks for ${cur.label} (${cur.months})`} right={cur.blurb} />
        <div role="tablist" aria-label="Season" className="mb-6 flex flex-wrap gap-2">
          {seasons.map((s) => (
            <button key={s.id} role="tab" aria-selected={s.id === season} onClick={() => setSeason(s.id)}
              className={`rounded-full border px-4 py-1.5 font-head text-xs font-bold transition ${s.id === season ? 'border-ihyellow bg-ihyellow text-black' : 'border-[#d0d0d0] bg-white text-black hover:border-ihyellow'}`}>{s.label}</button>
          ))}
        </div>
        <div className="relative">
          <button onClick={() => slide(-1)} aria-label="Previous treks" className="absolute -left-2 top-1/2 z-10 hidden -translate-y-1/2 text-[#777] hover:text-black md:block lg:-left-9"><ChevronsLeft className="h-7 w-7" /></button>
          <div ref={track} className="flex snap-x gap-5 overflow-x-auto scroll-smooth px-1 pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {loading ? [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-[330px] w-[262px] shrink-0" />) : !data?.length
              ? <p className="w-full rounded border border-dashed border-[#ccc] p-8 text-center text-sm">No treks are listed for this season yet.</p>
              : data.map((t) => <TrekTile key={t.id} t={t} />)}
          </div>
          <button onClick={() => slide(1)} aria-label="Next treks" className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 text-[#777] hover:text-black md:block lg:-right-9"><ChevronsRight className="h-7 w-7" /></button>
        </div>
        <div className="mt-2 text-center"><Link to={`/treks/season/${season}`} className="inline-block rounded-sm bg-ihyellow px-6 py-2 font-head text-xs font-bold text-black shadow hover:brightness-95">View all {cur.label.toLowerCase()} treks</Link></div>
      </div>
    </section>
  );
}