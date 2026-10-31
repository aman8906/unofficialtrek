import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Star, X, CloudSun, Thermometer, ShieldCheck, Stethoscope, Tent, Utensils, Map, HeartHandshake, Waves, ArrowUpFromLine, Home as HomeIcon } from 'lucide-react';
import { seasons as seasonList, advantages as advData, reasons as reasonData, partners as partnerData } from '../data/mock';
import { getTreks, getTestimonials, getWeather, getFaqs, getActivities, getVillages } from '../services/api';
import { useAsync } from '../lib/hooks';
import { useSettings } from '../lib/store';
import { Accordion, ImageBox, Skeleton, SectionHeading, Badge } from './ui';
import TrekCard from './TrekCard';
import { pageImage, PHOTOS } from '../data/images';
const icons = { ShieldCheck, Stethoscope, Tent, Utensils, Map, HeartHandshake };

export function Hero() {
  const s = useSettings();
  const [q, setQ] = useState('');
  const nav = useNavigate();
  return (
    <section className="relative isolate overflow-hidden text-white">
      <ImageBox
  src={pageImage('home', 1800)}
  hue={160}
  eager
  className="absolute inset-0 -z-10"
/>
<div className="absolute inset-0 -z-10 bg-linear-to-r from-black/70 via-black/40 to-black/10" />
      <div className="container py-20 sm:py-28 lg:py-36">
        <Badge tone="light">Only Uttarakhand</Badge>
        <h1 className="mt-5 max-w-3xl text-white">{s.heroTitle}</h1>
        <p className="mt-5 max-w-2xl text-base text-white/90 sm:text-lg">{s.heroSub}</p>
        <form onSubmit={(e) => { e.preventDefault(); nav(`/treks?q=${encodeURIComponent(q)}`); }} className="mt-8 flex max-w-xl items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-card-hover">
          <Search className="h-5 w-5 shrink-0 text-brand" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a trek, like Kedarkantha" className="w-full bg-transparent py-2 text-sm text-ink placeholder:text-body/60 focus:outline-hidden" aria-label="Search treks" />
          <button className="btn-primary shrink-0 px-5 py-2.5">Search</button>
        </form>
        <div className="mt-6 flex flex-wrap gap-2">
          {seasonList.map((x) => (
            <Link key={x.id} to={`/treks/season/${x.id}`} className="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm transition hover:bg-white hover:text-brand">{x.label}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrekGrid({ params, empty = 'No treks found for this filter.' }) {
  const { data, loading } = useAsync(() => getTreks(params), [JSON.stringify(params)]);
  if (loading) return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-80" />)}</div>;
  if (!data?.length) return <p className="rounded-card border border-dashed border-line bg-white p-8 text-center">{empty}</p>;
  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{data.map((t) => <TrekCard key={t.id} trek={t} />)}</div>;
}

export function SeasonTabs() {
  const [active, setActive] = useState('winter');
  const cur = seasonList.find((x) => x.id === active);
  return (
    <section className="section">
      <div className="container">
        <SectionHeading title="Pick a trek by season" subtitle="Four seasons, four different Uttarakhands. Choose the months you can travel." />
        <div role="tablist" className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {seasonList.map((x) => (
            <button key={x.id} role="tab" aria-selected={active === x.id} onClick={() => setActive(x.id)}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-left transition ${active === x.id ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink hover:border-brand'}`}>
              <span className="block text-sm font-semibold">{x.label}</span>
              <span className={`block text-xs ${active === x.id ? 'text-white/80' : 'text-body'}`}>{x.months}</span>
            </button>
          ))}
        </div>
        <p className="mb-6 max-w-2xl">{cur.blurb}</p>
        <TrekGrid params={{ season: active }} />
        <div className="mt-8 text-center"><Link to={`/treks/season/${active}`} className="btn-outline">See all {cur.label.toLowerCase()} treks <ArrowRight className="h-4 w-4" /></Link></div>
      </div>
    </section>
  );
}

export function FeaturedTreks() {
  return (
    <section className="section section-alt">
      <div className="container">
        <SectionHeading title="Most loved treks" subtitle="Hand-picked by our guides for first-timers and regulars." />
        <TrekGrid params={{ featured: true }} />
      </div>
    </section>
  );
}

export function AdventureGrid() {
  const { data: acts } = useAsync(() => getActivities(), []);
  const { data: vill } = useAsync(() => getVillages(), []);

  const cards = [
    {
      to: '/rafting',
      title: 'Rafting',
      text: 'Grade II to IV rapids on the Ganga.',
      hue: 195,
      img: PHOTOS.raft1(700),
      Icon: Waves,
      extra: acts?.filter((a) => a.type === 'rafting').length,
    },
    {
      to: '/bungee-jumping',
      title: 'Bungee Jumping',
      text: 'An 83 m jump with a trained crew.',
      hue: 12,
      img: PHOTOS.bungee(700),
      Icon: ArrowUpFromLine,
      extra: acts?.filter((a) => a.type === 'bungee').length,
    },
    {
      to: '/villages',
      title: 'Villages & Culture',
      text: 'Homestays, food and mountain traditions.',
      hue: 35,
      img: PHOTOS.village(700),
      Icon: HomeIcon,
      extra: vill?.length,
    },
  ];

  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          title="More than trekking"
          subtitle="Add a river, a jump or a village stay to your Uttarakhand trip."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map(({ to, title, text, hue, img, Icon, extra }) => (
            <Link key={to} to={to} className="card group overflow-hidden">
              <ImageBox
                src={img}
                alt={title}
                hue={hue}
                className="h-48"
              >
                <span className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white text-brand">
                  <Icon className="h-5 w-5" />
                </span>
              </ImageBox>

              <div className="p-5">
                <h3 className="group-hover:text-brand">{title}</h3>
                <p className="mt-1 text-sm">{text}</p>

                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                  {extra ? `${extra} options` : 'Explore'}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialMarquee() {
  const { data } = useAsync(() => getTestimonials(), []);
  const [open, setOpen] = useState(null);
  const list = data || [];
  const loop = [...list, ...list];
  return (
    <section className="section section-alt overflow-hidden">
      <div className="container"><SectionHeading title="Why trekkers love us" subtitle="Real stories from our groups. Tap a card to read it all." /></div>
      <div className="group/marquee relative">
        <div className="flex w-max animate-marquee py-2 hover:[animation-play-state:paused]">
          {loop.map((t, i) => (
            <button key={`${t.id}-${i}`} onClick={() => setOpen(t)} className="card mr-5 w-[290px] shrink-0 p-5 text-left sm:w-[360px]">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-brand text-lg font-semibold text-white">{t.name?.[0]}</span>
                <span><span className="block font-heading font-semibold text-ink">{t.name}</span><span className="block text-xs">{t.designation}</span></span>
              </div>
              <div className="mb-2 flex gap-0.5 text-accent">{Array.from({ length: t.rating || 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}</div>
              <p className="mb-2 font-medium text-ink">{t.headline}</p>
              <p className="line-clamp-3 text-sm">{t.excerpt}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-brand">Read more</span>
            </button>
          ))}
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setOpen(null)}>
          <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-card bg-white p-6 shadow-card-hover" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(null)} aria-label="Close" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100"><X className="h-5 w-5" /></button>
            <h3 className="pr-8">{open.headline}</h3>
            <p className="mt-1 text-sm">{open.name}, {open.designation}</p>
            <p className="mt-4 leading-relaxed">{open.excerpt}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export function WeatherSection({ full = false }) {
  const { data, loading, error } = useAsync(() => getWeather(), []);
  const list = data || [];
  return (
    <section className={full ? 'section' : 'section'}>
      <div className="container">
        <SectionHeading title="Latest weather and trek updates" subtitle={list[0] ? `Updated ${list[0].updatedAt}` : 'Fresh from our basecamps every morning.'} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-56" />) : error ? (
            <p role="alert" className="col-span-full rounded-card border border-dashed border-line bg-white p-8 text-center">Could not load weather updates right now. Please try again later.</p>
          ) : !list.length ? (
            <p className="col-span-full rounded-card border border-dashed border-line bg-white p-8 text-center">No weather updates yet.</p>
          ) : list.map((w) => (
            <article key={w.id} className="card p-5">
              <h3 className="text-lg">{w.basecamp} <span className="font-body text-sm font-normal">({w.trek})</span></h3>
              <div className="my-3 flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1.5"><CloudSun className="h-4 w-4 text-accent" />{w.condition}</span>
                <span className="flex items-center gap-1.5"><Thermometer className="h-4 w-4 text-accent" />{w.min}° to {w.max}°C</span>
              </div>
              <ul className="space-y-1.5 border-t border-line pt-3 text-sm">{(w.bullets || []).map((b, i) => <li key={i} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{b}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function ReasonList() {
  return (
    <section className="section section-alt">
      <div className="container">
        <SectionHeading title="Five reasons to trek with us" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasonData.map((r, i) => (
            <div key={r.id} className={`card p-6 ${i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
              <h3 className="mb-2 text-brand">{r.title}</h3><p className="text-sm leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AdvantageGrid() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading title="The Unofficial Trek advantage" center />
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {advData.map((a) => { const Icon = icons[a.icon] || ShieldCheck; return (
            <div key={a.id} className="flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-light text-brand"><Icon className="h-7 w-7" /></span>
              <div><h3 className="text-lg">{a.title}</h3><p className="mt-1 text-sm">{a.text}</p></div>
            </div>); })}
        </div>
      </div>
    </section>
  );
}

export function PartnerStrip() {
  return (
    <section className="section-alt border-y border-line py-10">
      <div className="container">
        <p className="mb-6 text-center font-heading text-lg font-semibold text-ink">Trusted by local partners</p>
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible">
          {partnerData.map((p) => <span key={p} className="shrink-0 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-body grayscale transition hover:text-brand hover:grayscale-0">{p}</span>)}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  const { data } = useAsync(() => getFaqs(), []);
  return (
    <section className="section">
      <div className="container grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div><SectionHeading title="Questions before you book?" subtitle="Quick answers to what trekkers ask most." /><Link to="/contact" className="btn-brand">Ask our team</Link></div>
        {data && <Accordion items={data.map((f) => ({ id: f.id, title: f.question, content: f.answer }))} />}
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="relative isolate overflow-hidden py-16 text-white">
      <ImageBox
        src={pageImage('cta', 1600)}
        hue={160}
        className="absolute inset-0 -z-10"
      />

      <div className="absolute inset-0 -z-10 bg-brand-dark/80" />

      <div className="container flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div>
          <h2 className="text-white">Not sure which trek fits you?</h2>
          <p className="mt-2 text-white/80">
            Tell us your dates and fitness level. We will suggest the right trail.
          </p>
        </div>

        <Link to="/contact" className="btn-primary shrink-0">
          Talk to a trek advisor
        </Link>
      </div>
    </section>
  );
}