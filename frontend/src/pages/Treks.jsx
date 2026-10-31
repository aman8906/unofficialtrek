import { useState } from 'react';
import { useParams, useSearchParams, Link, Navigate } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { seasons } from '../data/mock';
import { TrekGrid } from '../components/sections';
import PageHero from './PageHero';
import { pageImage, seasonImage } from '../data/images';

const DIFF = ['Easy-Moderate', 'Moderate', 'Difficult'];

export function AllTreks() {
  const [sp, setSp] = useSearchParams();
  const [show, setShow] = useState(false);
  const params = Object.fromEntries(sp.entries());
  const set = (k, v) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n); };
  const Filters = (
    <div className="space-y-6">
      <div><label className="label" htmlFor="q">Search</label><input id="q" className="input" defaultValue={params.q || ''} onKeyDown={(e) => e.key === 'Enter' && set('q', e.target.value)} onBlur={(e) => set('q', e.target.value)} placeholder="Trek or region" /></div>
      <div><p className="label">Season</p>{seasons.map((s) => (
        <label key={s.id} className="flex cursor-pointer items-center gap-2 py-1.5 text-sm"><input type="radio" name="season" checked={params.season === s.id} onChange={() => set('season', s.id)} className="accent-[#1f4d3a]" />{s.label} <span className="text-xs">({s.months})</span></label>))}
        <label className="flex cursor-pointer items-center gap-2 py-1.5 text-sm"><input type="radio" name="season" checked={!params.season} onChange={() => set('season', '')} className="accent-[#1f4d3a]" />Any season</label></div>
      <div><label className="label" htmlFor="df">Difficulty</label><select id="df" className="input" value={params.difficulty || ''} onChange={(e) => set('difficulty', e.target.value)}><option value="">Any</option>{DIFF.map((d) => <option key={d}>{d}</option>)}</select></div>
      <div><label className="label" htmlFor="md">Max duration</label><select id="md" className="input" value={params.maxDays || ''} onChange={(e) => set('maxDays', e.target.value)}><option value="">Any</option><option value="6">Up to 6 days</option><option value="7">Up to 7 days</option><option value="8">Up to 8 days</option></select></div>
      <button className="btn-outline w-full" onClick={() => setSp({})}>Clear filters</button>
    </div>
  );
  return (
    <>
     <PageHero
  title="All Uttarakhand treks"
  sub="Filter by season, difficulty and duration."
  image={pageImage('treks')}
  crumbs={[['Treks']]}
/>
      <section className="section">
        <div className="container grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block"><div className="sticky top-24 rounded-card border border-line bg-white p-5">{Filters}</div></aside>
          <div>
            <div className="mb-6 flex items-center justify-between gap-3">
              <button className="btn-outline lg:hidden" onClick={() => setShow(true)}><SlidersHorizontal className="h-4 w-4" />Filters</button>
              <div className="ml-auto flex items-center gap-2"><label htmlFor="so" className="text-sm">Sort</label>
                <select id="so" className="input w-auto" value={params.sort || ''} onChange={(e) => set('sort', e.target.value)}><option value="">Recommended</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="days">Shortest first</option></select></div>
            </div>
            <TrekGrid params={params} />
          </div>
        </div>
      </section>
      {show && (
        <div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-black/40" onClick={() => setShow(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5">
            <div className="mb-4 flex items-center justify-between"><h3>Filters</h3><button onClick={() => setShow(false)} aria-label="Close filters"><X className="h-6 w-6" /></button></div>
            {Filters}<button className="btn-primary mt-6 w-full" onClick={() => setShow(false)}>Show results</button></div></div>
      )}
    </>
  );
}

export function SeasonPage() {
  const { season } = useParams();
  const cur = seasons.find((s) => s.id === season);
  if (!cur) return <Navigate to="/treks" replace />;
  return (
    <>
      <PageHero
  title={`${cur.label} treks in Uttarakhand`}
  sub={`${cur.months}. ${cur.blurb}`}
  hue={cur.hue}
  image={seasonImage(cur.id)}
  crumbs={[['Treks', '/treks'], [cur.label]]}
/>
      <section className="section">
        <div className="container">
          <div className="mb-8 flex flex-wrap gap-2">{seasons.map((s) => <Link key={s.id} to={`/treks/season/${s.id}`} className={`rounded-full border px-4 py-2 text-sm ${s.id === season ? 'border-brand bg-brand text-white' : 'border-line hover:border-brand'}`}>{s.label}</Link>)}</div>
          <TrekGrid params={{ season }} empty="No treks are listed for this season yet." />
        </div>
      </section>
    </>
  );
}
