import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { stories } from '../data/stories';
import { PHOTOS } from '../data/images';
import { ImageBox } from '../components/ui';
import NotFound from './NotFound';

export default function StoryDetail() {
  const { slug } = useParams();
  const s = stories.find((x) => x.slug === slug);
  if (!s) return <NotFound />;
  const more = stories.filter((x) => x.slug !== s.slug).slice(0, 3);
  return (
    <article className="pb-14">
      <ImageBox src={PHOTOS[s.photo]?.(1600)} hue={190} alt={s.title} eager className="h-[260px] sm:h-[380px]" />
      <div className="mx-auto max-w-[720px] px-4 pt-8">
        <Link to="/explorations" className="mb-5 inline-flex items-center gap-1.5 text-sm text-ihlink hover:underline"><ArrowLeft className="h-4 w-4" />All explorations</Link>
        {s.tag && <p className="mb-3 inline-block border-b-2 border-ihyellow pb-0.5 font-head text-[12px] font-extrabold tracking-wide text-black">{s.tag}</p>}
        <h1 className="font-serif text-[28px] font-bold leading-tight text-black sm:text-[34px] lg:text-[38px]">{s.title}</h1>
        <p className="mt-3 font-serif text-[12.5px] text-[#555]"><span className="italic">By {s.author}</span> | {s.date} | {s.read} min read</p>
        <div className="mt-8 space-y-5 font-serif text-[16px] leading-[1.7] text-black">{s.body.map((p, i) => <p key={i}>{p}</p>)}</div>
        <div className="mt-10 rounded bg-ihbar p-5 text-sm text-black">Ready to walk it yourself? <Link to="/upcoming" className="font-semibold text-ihlink underline">See upcoming treks</Link> or <Link to="/contact" className="font-semibold text-ihlink underline">talk to a trek advisor</Link>.</div>
      </div>
      <div className="mx-auto mt-14 max-w-[1060px] px-4">
        <h2 className="mb-5 font-head text-2xl font-extrabold text-black sm:text-2xl lg:text-2xl">More stories</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {more.map((m) => (
            <Link key={m.slug} to={`/explorations/${m.slug}`} className="group overflow-hidden bg-white shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition hover:-translate-y-1">
              <ImageBox src={PHOTOS[m.photo]?.(600)} hue={190} alt="" className="h-[150px]" />
              <div className="p-4"><h3 className="font-serif text-[14.5px] font-bold leading-snug text-black">{m.title}</h3></div>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}