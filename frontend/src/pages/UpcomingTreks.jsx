import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { getTreks, getAllBatches } from '../services/api';
import { useAsync } from '../lib/hooks';
import { ImageBox, Skeleton } from '../components/ui';
import { PHOTOS } from '../data/images';
import { MONTH_SEASONS, DIFFICULTY_RANK, viewsSlugs, sectionText, exploreTiles, themedTiles, adventureTiles, notices } from '../data/upcoming';
import { HomeHeading } from '../components/home/primitives';
import SearchBand from '../components/upcoming/SearchBand';
import Sidebar from '../components/upcoming/Sidebar';
import TrekTile from '../components/upcoming/TrekTile';
import TrekCarousel from '../components/upcoming/TrekCarousel';
import TileCarousel from '../components/upcoming/TileCarousel';
import NoticeBar from '../components/upcoming/NoticeBar';
import { DatesModal, CompareModal } from '../components/upcoming/Modals';
import AdvantageCards from '../components/home/AdvantageCards';
import PartnerCta from '../components/home/PartnerCta';

const scrollToSec = (id) => document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export default function UpcomingTreks() {
  const [sp] = useSearchParams();
  const { data, loading } = useAsync(() => getTreks(), []);
  const { data: batches } = useAsync(() => getAllBatches(), []);
  const treks = data || [];

  const [filters, setFilters] = useState({});
  const [range, setRange] = useState({ from: '', to: '' });
  const [datesFor, setDatesFor] = useState(null);
  const [compare, setCompare] = useState(false);
  const [showSide, setShowSide] = useState(false);
  const results = useRef(null);

  // /upcoming?trek=Kedarkantha (from the home page) opens that trek's dates
  useEffect(() => {
    const name = sp.get('trek');
    if (name && treks.length) { const t = treks.find((x) => x.title === name); if (t) setDatesFor(t); }
  }, [treks.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (key, val) => {
    if (key === 'clear') return setFilters({});
    setFilters((f) => ({ ...f, [key]: f[key] === val ? '' : val }));
    setTimeout(() => results.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };
  const applyTheme = (t) => { setFilters(t.filter); setTimeout(() => results.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); };
  const clearAll = () => { setFilters({}); setRange({ from: '', to: '' }); };

  const regions = useMemo(() => [...new Set(treks.map((t) => t.region).filter(Boolean))], [treks]);
  const rangeActive = !!(range.from || range.to);
  const active = rangeActive || Object.values(filters).some(Boolean);

  const filtered = useMemo(() => {
    const inRange = rangeActive
      ? new Set((batches || []).filter((b) => (!range.from || b.startDate >= range.from) && (!range.to || b.startDate <= range.to)).map((b) => b.trek))
      : null;
    return treks.filter((t) => {
      if (filters.difficulty && t.difficulty !== filters.difficulty) return false;
      if (filters.season && !(t.seasons || []).includes(filters.season)) return false;
      if (filters.month && !MONTH_SEASONS[filters.month].some((s) => (t.seasons || []).includes(s))) return false;
      if (filters.days) { if (filters.days === '7+' ? t.days < 7 : t.days !== Number(filters.days)) return false; }
      if (filters.region && t.region !== filters.region) return false;
      if (inRange && !inRange.has(t.title)) return false;
      return true;
    });
  }, [treks, filters, range, rangeActive, batches]);

  // curated rows
  const winter = treks.filter((t) => (t.seasons || []).includes('winter'));
  const views = viewsSlugs.map((s) => treks.find((t) => t.slug === s)).filter(Boolean);
  const beginners = treks.filter((t) => ['Easy', 'Easy-Moderate'].includes(t.difficulty)).sort((a, b) => a.days - b.days);
  const easiest = [...treks].sort((a, b) => (DIFFICULTY_RANK[a.difficulty] ?? 9) - (DIFFICULTY_RANK[b.difficulty] ?? 9) || a.altitude - b.altitude).slice(0, 5);
  const popular = treks.filter((t) => t.badge || t.isFeatured);

  const chips = [...Object.entries(filters).filter(([, v]) => v).map(([k, v]) => [k, v === '7+' ? '7+ days' : /^\d$/.test(v) ? `${v} days` : v]), ...(rangeActive ? [['range', `${range.from || '…'} to ${range.to || '…'}`]] : [])];
  const removeChip = (k) => (k === 'range' ? setRange({ from: '', to: '' }) : setFilters((f) => ({ ...f, [k]: '' })));

  return (
    <>
      <SearchBand />
      <div className="lg:grid lg:grid-cols-[250px_1fr]">
        {/* left cream column */}
        <aside className="bg-[#fff5d2] lg:sticky lg:top-[124px] lg:max-h-[calc(100vh-124px)] lg:self-start lg:overflow-y-auto lg:[scrollbar-color:#ffcc00_#fff5d2] lg:[scrollbar-width:thin]">
          <button onClick={() => setShowSide(!showSide)} aria-expanded={showSide} className="flex w-full items-center justify-between px-5 py-3 font-head text-sm font-bold lg:hidden"><span className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" />Filters{active ? ' (on)' : ''}</span><span>{showSide ? 'Hide' : 'Show'}</span></button>
          <div className={`${showSide ? 'block' : 'hidden'} lg:block`}>
            <Sidebar filters={filters} pick={pick} range={range} setRange={setRange} regions={regions} onCompare={() => setCompare(true)} />
          </div>
        </aside>

        {/* main column */}
        <div className="min-w-0 px-4 pb-10 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[900px]">
            {active && (
              <section ref={results} className="scroll-mt-36 py-7">
                <HomeHeading title={`${filtered.length} trek${filtered.length === 1 ? '' : 's'} found`} right="Filtered by your choices on the left." />
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  {chips.map(([k, v]) => <button key={k} onClick={() => removeChip(k)} className="flex items-center gap-1 rounded-full bg-ihyellow px-3 py-1 font-head text-xs font-bold capitalize">{v}<X className="h-3 w-3" /></button>)}
                  <button onClick={clearAll} className="text-xs text-ihlink underline">Clear all</button>
                </div>
                {!filtered.length ? <p className="rounded border border-dashed border-[#ccc] p-8 text-center text-sm">No treks match these filters. Try removing one.</p>
                  : <div className="grid justify-items-center gap-5 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((t) => <TrekTile key={t.id} t={t} full onDates={setDatesFor} />)}</div>}
              </section>
            )}

            {!active && (loading ? <div className="grid gap-4 py-10 sm:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-72" />)}</div> : (
              <>
                <section className="pt-9">
                  <HomeHeading title="Explore Our Top Categories" />
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-5">
                    {exploreTiles.map((t) => (
                      <button key={t.label} onClick={() => scrollToSec(t.to)} className="group w-[104px] text-center">
                        <ImageBox src={PHOTOS[t.photo]?.(300)} hue={200} alt="" className="mx-auto h-24 w-24 rounded-xl shadow transition group-hover:scale-105" />
                        <span className="mt-2 block font-head text-[12.5px] font-semibold leading-tight text-black">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </section>
                <NoticeBar {...notices.compare} label={notices.compare.link} onClick={() => setCompare(true)} />
                <TrekCarousel id="winter" title="Top Treks in Winter (Dec-Feb)" right={sectionText.winter} treks={winter} onDates={setDatesFor} />
                <TrekCarousel id="views" title="Treks with Greatest Mountain Views" right={sectionText.views} treks={views} onDates={setDatesFor} />
                <TrekCarousel id="beginners" title="Best Treks for Beginners" right={sectionText.beginners} treks={beginners} onDates={setDatesFor} />
                <NoticeBar {...notices.winter} label={notices.winter.link} />
                <TrekCarousel id="easiest" title="Top 5 Easiest Treks" right={sectionText.easiest} treks={easiest} onDates={setDatesFor} />
                <TileCarousel id="themed" title="Themed Treks" right={sectionText.themed} tiles={themedTiles} onPick={applyTheme} />
                <TrekCarousel id="popular" title="Popular & Trending Treks" right={sectionText.popular} treks={popular} onDates={setDatesFor} />
                <NoticeBar {...notices.group} label={notices.group.link} />
                <TileCarousel id="adventures" title="Adventures Beyond Trekking" right={sectionText.adventures} tiles={adventureTiles} />
              </>
            ))}
          </div>
          <AdvantageCards title="Why Trekkers Love Trekking With Us" />
        </div>
      </div>
      <PartnerCta />
      {datesFor && <DatesModal trek={datesFor} onClose={() => setDatesFor(null)} />}
      {compare && <CompareModal treks={treks} onClose={() => setCompare(false)} />}
    </>
  );
}