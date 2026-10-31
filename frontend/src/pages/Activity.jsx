import { Clock, MapPin, Gauge, ShieldCheck } from 'lucide-react';
import { getActivities, getVillages } from '../services/api';
import { useAsync } from '../lib/hooks';
import { ImageBox, Rupee, Skeleton, Badge } from '../components/ui';
import { EnquiryForm } from '../components/Forms';
import PageHero from './PageHero';
import { pageImage, activityImage, villageImage } from '../data/images';
export function ActivityPage({ type }) {
  const copy = type === 'bungee'
    ? { title: 'Bungee jumping in Rishikesh', sub: 'Book a slot, meet the crew and take the jump. Safety checks come first.', hue: 12 }
    : { title: 'River rafting in Rishikesh', sub: 'Pick your stretch of the Ganga and the grade of rapids you want.', hue: 195 };
  const { data, loading } = useAsync(() => getActivities(type), [type]);
  return (
    <>
      <PageHero
  title={copy.title}
  sub={copy.sub}
  hue={copy.hue}
  image={pageImage(type === 'bungee' ? 'bungee' : 'rafting')}
  crumbs={[[type === 'bungee' ? 'Bungee Jumping' : 'Rafting']]}
/>
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {loading ? <Skeleton className="h-64" /> : data.map((a) => (
              <article key={a.id} className="card overflow-hidden md:flex">
                <ImageBox
  hue={a.hue}
  src={activityImage(a, 700)}
  alt={a.title}
  className="h-48 md:h-auto md:w-64 md:shrink-0"
/>
                <div className="p-5">
                  <h3>{a.title}</h3><p className="mt-1 text-sm">{a.shortDesc}</p>
                  <div className="my-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-brand" />{a.location}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-brand" />{a.duration}</span>
                    <span className="flex items-center gap-1.5"><Gauge className="h-4 w-4 text-brand" />{a.grade}</span>
                  </div>
                  <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-ink"><ShieldCheck className="h-4 w-4 text-brand" />Safety</p>
                  <ul className="mb-4 list-disc space-y-1 pl-5 text-sm">{(a.safety || []).map((s) => <li key={s}>{s}</li>)}</ul>
                  <p className="font-heading text-xl font-bold text-ink"><Rupee value={a.price} /> <span className="font-body text-sm font-normal">per person</span></p>
                </div>
              </article>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start"><EnquiryForm kind="booking" title="Book a slot" subject={copy.title} extra={{ type, price: data?.[0]?.price || 0 }} cta="Request booking" /></aside>
        </div>
      </section>
    </>
  );
}

export function VillagesPage() {
  const { data, loading } = useAsync(() => getVillages(), []);
  return (
    <>
      <PageHero
  title="Villages and culture"
  sub="Stay with local families, eat village food and learn how mountain life works."
  hue={35}
  image={pageImage('villages')}
  crumbs={[[ 'Villages & Culture' ] ]}
/>
      <section className="section">
        <div className="container grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-80" />) : data.map((v) => (
            <article key={v.id} className="card overflow-hidden">
              <ImageBox
  hue={v.hue}
  src={villageImage(v, 700)}
  alt={v.title}
  className="h-52"
/>
              <div className="p-5"><div className="mb-2 flex items-center justify-between"><h3>{v.title}</h3><Badge tone="brand">{v.district}</Badge></div>
                <p className="mb-3 text-sm">{v.shortDesc}</p>
                <ul className="flex flex-wrap gap-2">{(v.highlights || []).map((h) => <li key={h}><Badge tone="grey">{h}</Badge></li>)}</ul></div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
