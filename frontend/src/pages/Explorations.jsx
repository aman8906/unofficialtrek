import { Link } from 'react-router-dom';
import { bySection } from '../data/stories';
import { PHOTOS } from '../data/images';
import { ImageBox } from '../components/ui';
import { HomeHeading } from '../components/home/primitives';

const wrap = 'mx-auto w-full max-w-[1060px] px-4 sm:px-6';
const shadow = 'shadow-[0_2px_8px_rgba(0,0,0,0.25)]';

const Meta = ({ s, big }) => (
  <div className={`font-serif text-[#555] ${big ? 'mt-4 text-[12px]' : 'mt-3 text-[11px]'}`}>
    <p className="italic">By {s.author}</p>
    <p>{s.date}{big && s.read ? ` | ${s.read} min read` : ''}</p>
  </div>
);
const Img = ({ s, className }) => <ImageBox src={PHOTOS[s.photo]?.(900)} hue={190} alt={s.title} className={className} />;

function SmallCard({ s, imgH = 'h-[215px] sm:h-[240px]' }) {
  return (
    <Link to={`/explorations/${s.slug}`} className={`group flex flex-col overflow-hidden rounded-[2px] bg-white transition hover:-translate-y-1 ${shadow}`}>
      <Img s={s} className={`${imgH} transition group-hover:brightness-95`} />
      <div className="flex-1 px-4 pb-4 pt-3"><h3 className="font-serif text-[14.5px] font-bold leading-snug text-black">{s.title}</h3><Meta s={s} /></div>
    </Link>
  );
}

export default function Explorations() {
  const ex = bySection('exploration');
  const ic = bySection('iconic');
  const pe = bySection('personal');
  return (
    <>
      <section className="bg-ihbar/60 py-10 text-center">
        <h1 className="font-head text-[30px] font-extrabold text-black sm:text-[36px] lg:text-[40px]">Our Explorations</h1>
        <p className="mx-auto mt-2 max-w-xl px-4 text-sm text-black">Stories from the treks, villages and valleys of Uttarakhand, told by our team and our trekkers.</p>
      </section>

      <section className="py-9"><div className={wrap}>
        <HomeHeading title="Exploration Stories" />
        {ex[0] && (
          <Link to={`/explorations/${ex[0].slug}`} className={`group grid overflow-hidden bg-white md:grid-cols-[1.25fr_1fr] ${shadow}`}>
            <Img s={ex[0]} className="h-[260px] md:h-[320px]" />
            <div className="flex flex-col justify-center px-6 py-6 sm:px-12">
              {ex[0].tag && <span className="mb-6 inline-block self-start border-b-2 border-ihyellow pb-0.5 font-head text-[12px] font-extrabold tracking-wide text-black">{ex[0].tag}</span>}
              <h2 className="font-serif text-[24px] font-bold leading-snug text-black group-hover:underline sm:text-[26px] lg:text-[28px]">{ex[0].title}</h2>
              <Meta s={ex[0]} big />
            </div>
          </Link>
        )}
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{ex.slice(1).map((s) => <SmallCard key={s.slug} s={s} />)}</div>
      </div></section>

      <section className="py-9"><div className={wrap}>
        <HomeHeading title="Iconic Explorations" />
        <div className="grid gap-5 lg:grid-cols-[2.1fr_1fr_1fr]">
          {ic[0] && (
            <Link to={`/explorations/${ic[0].slug}`} className={`group overflow-hidden bg-white transition hover:-translate-y-1 lg:row-span-2 ${shadow}`}>
              <Img s={ic[0]} className="h-[260px] sm:h-[320px]" />
              <div className="px-6 pb-6 pt-5"><h2 className="font-serif text-[24px] font-bold leading-snug text-black sm:text-[28px]">{ic[0].title}</h2><Meta s={ic[0]} /></div>
            </Link>
          )}
          {ic.slice(1).map((s) => <SmallCard key={s.slug} s={s} imgH="h-[165px]" />)}
        </div>
      </div></section>

      <section className="py-9"><div className={wrap}>
        <HomeHeading title="Personal Stories" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{pe.map((s) => <SmallCard key={s.slug} s={s} imgH="h-[240px]" />)}</div>
      </div></section>

      <section className="pb-14 pt-4 text-center"><p className="mb-4 text-sm">Want to see these places yourself?</p><Link to="/upcoming" className="inline-block rounded-sm bg-ihyellow px-7 py-2.5 font-head text-sm font-bold text-black shadow hover:brightness-95">View Upcoming Treks</Link></section>
    </>
  );
}