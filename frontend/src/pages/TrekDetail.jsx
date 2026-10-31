import { useParams, Link } from 'react-router-dom';
import { Clock, Mountain, MapPin, Gauge, CheckCircle2, XCircle, CalendarDays } from 'lucide-react';
import { getTrek, getBatches } from '../services/api';
import { useAsync } from '../lib/hooks';
import { Accordion, Skeleton, Rupee, Badge, SectionHeading } from '../components/ui';
import { EnquiryForm } from '../components/Forms';
import { TrekGrid } from '../components/sections';
import PageHero from './PageHero';
import NotFound from './NotFound';
import { trekImage } from '../data/images';

const INC = ['Tents, sleeping bags and mats', 'All meals during the trek', 'Trek leader and local guides', 'Forest permits and camping fees', 'First-aid kit and oxygen cylinder'];
const EXC = ['Travel to and from the base camp', 'Personal gear and clothing', 'Trek insurance', 'Porter or offloading charges', 'Anything not listed in inclusions'];

export default function TrekDetail() {
  const { slug } = useParams();
  const { data: t, loading } = useAsync(() => getTrek(slug), [slug]);
  const { data: batches } = useAsync(() => (t ? getBatches(t.title) : []), [t?.title]);
  if (loading) return <div className="container section"><Skeleton className="mb-6 h-60" /><Skeleton className="h-96" /></div>;
  if (!t) return <NotFound />;
  const facts = [[Clock, 'Duration', `${t.days} days`], [Mountain, 'Max altitude', `${Number(t.altitude).toLocaleString('en-IN')} ft`], [Gauge, 'Difficulty', t.difficulty], [MapPin, 'Region', t.region]];

  return (
    <>
     <PageHero
  title={t.title}
  sub={t.shortDesc}
  hue={t.hue}
  image={trekImage(t, 1600)}
  crumbs={[['Treks', '/treks'], [t.title]]}
/>
      <section className="border-b border-line bg-white">
        <div className="container grid grid-cols-2 gap-4 py-5 md:grid-cols-4">
          {facts.map(([Icon, label, val]) => (<div key={label} className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-brand-light text-brand"><Icon className="h-5 w-5" /></span><div><p className="text-xs">{label}</p><p className="font-heading font-semibold text-ink">{val}</p></div></div>))}
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-12">
            <div><h2 className="heading-underline">Highlights</h2>
              <ul className="grid gap-3 sm:grid-cols-2">{(t.highlights || []).map((h) => <li key={h} className="flex gap-3 rounded-card border border-line bg-white p-4"><CheckCircle2 className="h-5 w-5 shrink-0 text-brand" /><span className="text-sm">{h}</span></li>)}</ul></div>

            <div><h2 className="heading-underline">Day-wise itinerary</h2>
              <Accordion items={(t.itinerary || []).map((d) => ({ id: d.day, title: `Day ${d.day}: ${d.title}`, content: <><p className="mb-2 text-sm font-medium text-brand">{d.distance}</p><p>{d.detail}</p></> }))} /></div>

            {t.seasonInfo?.length > 0 && (
              <div><h2 className="heading-underline">Best time to go</h2>
                <div className="overflow-x-auto rounded-card border border-line bg-white"><table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-section-alt text-ink"><tr><th className="p-3">Season</th><th className="p-3">Temperature</th><th className="p-3">Snow</th><th className="p-3">Warm layers</th></tr></thead>
                  <tbody>{t.seasonInfo.map((s) => <tr key={s.season} className="border-t border-line"><td className="p-3 font-medium text-ink">{s.season}</td><td className="p-3">{s.temp}</td><td className="p-3">{s.snow}</td><td className="p-3">{s.layers}</td></tr>)}</tbody></table></div></div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <div><h2 className="heading-underline text-2xl">Inclusions</h2><ul className="space-y-2">{INC.map((i) => <li key={i} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{i}</li>)}</ul></div>
              <div><h2 className="heading-underline text-2xl">Exclusions</h2><ul className="space-y-2">{EXC.map((i) => <li key={i} className="flex gap-2 text-sm"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />{i}</li>)}</ul></div>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-card border border-line bg-white p-5 shadow-card">
              <p className="text-sm">Trek fee per person</p>
              <p className="font-heading text-3xl font-bold text-ink"><Rupee value={t.price} /></p>
              <p className="mb-4 text-xs">+5% GST. Travel and insurance extra.</p>
              {batches?.length > 0 && <div className="mb-2"><p className="label flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />Open batches</p>
                <ul className="space-y-1.5 text-sm">{batches.map((b) => <li key={b.id} className="flex items-center justify-between rounded-lg bg-section-alt px-3 py-2"><span>{b.startDate} to {b.endDate}</span><Badge tone={b.seatsLeft < 5 ? 'red' : 'green'}>{b.seatsLeft} left</Badge></li>)}</ul></div>}
            </div>
            <EnquiryForm kind="booking" title="Book this trek" subject={t.title} extra={{ price: t.price, type: 'trek' }} cta="Request booking" />
          </aside>
        </div>
      </section>

      <section className="section section-alt"><div className="container"><SectionHeading title="You may also like" /><TrekGrid params={{ featured: true }} /></div></section>
    </>
  );
}
