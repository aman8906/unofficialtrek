import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Backpack, Leaf, Mountain, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { about } from '../data/about';
import { PHOTOS } from '../data/images';
import { ImageBox } from '../components/ui';
import { HomeHeading, PlayButton, VideoModal } from '../components/home/primitives';
import { useScrollDots } from '../components/upcoming/hooks';

const ICONS = { ShieldCheck, Backpack, Leaf, Mountain };
const wrap = 'mx-auto w-full max-w-[1040px] px-4 sm:px-6';

function Hero() {
  return (
    <section className="relative isolate flex min-h-[420px] items-end overflow-hidden text-center text-white sm:min-h-[480px]">
      <ImageBox src={PHOTOS[about.hero.photo]?.(1800)} hue={30} eager className="absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/70 via-black/25 to-black/10" />
      <div className="mx-auto max-w-[900px] px-4 pb-16 sm:pb-20">
        <h1 className="font-serif text-[30px] font-bold leading-[1.2] tracking-wide text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.6)] sm:text-[40px] lg:text-[46px]">{about.hero.title}</h1>
        <p className="mt-3 font-head text-[15px] font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.6)] sm:text-[17px]">{about.hero.sub}</p>
      </div>
    </section>
  );
}

function Vision() {
  const v = about.vision;
  const [open, setOpen] = useState(false);
  return (
    <section className="py-12">
      <div className="mx-auto w-full max-w-[540px] px-4">
        <HomeHeading title="Our Vision" />
        <div className="space-y-4 font-serif text-[14px] leading-snug text-black">{v.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>
        <ImageBox src={PHOTOS[v.photo]?.(1000)} hue={205} alt="Why we believe in the mountains" className="mt-10 aspect-video shadow-[0_3px_12px_rgba(0,0,0,0.3)]">
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 grid place-content-center text-center font-head font-black uppercase leading-none text-white">
            <span className="text-[22px] sm:text-[26px]">{v.caption[0]}</span>
            <span className="text-[38px] text-ihyellow sm:text-[52px]">{v.caption[1]}</span>
            <span className="text-[30px] sm:text-[42px]">{v.caption[2]}</span>
          </div>
          {v.videoUrl && <PlayButton onClick={() => setOpen(true)} label="Play video" />}
        </ImageBox>
      </div>
      {open && <VideoModal url={v.videoUrl} onClose={() => setOpen(false)} />}
    </section>
  );
}

function Known() {
  const track = useRef(null);
  const [video, setVideo] = useState('');
  const { pages, page, goto } = useScrollDots(track, about.known.length);
  const slide = (d) => track.current?.scrollBy({ left: d * 260, behavior: 'smooth' });
  const clips = about.known.filter((k) => k.videoUrl);
  return (
    <section className="py-10">
      <div className={wrap}>
        <HomeHeading title="What We Are Known For" gray />
        <div className="relative">
          <button onClick={() => slide(-1)} aria-label="Previous" className="absolute -left-9 top-1/2 z-10 hidden -translate-y-1/2 text-[#777] hover:text-black lg:block"><ChevronsLeft className="h-7 w-7" /></button>
          <div ref={track} className="flex snap-x gap-4 overflow-x-auto scroll-smooth px-1 pb-6 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {about.known.map((k) => {
              const Icon = ICONS[k.icon] || ShieldCheck;
              return (
                <article key={k.title} className="flex min-h-[285px] w-[243px] shrink-0 snap-start flex-col rounded bg-white px-5 py-5 shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-black"><Icon className="h-8 w-8" strokeWidth={1.6} /></span>
                    <h3 className="font-serif text-[19px] font-bold leading-[1.2] text-black">{k.title}</h3>
                  </div>
                  <p className="mt-4 font-serif text-[12.5px] leading-[1.45] text-black">{k.text}</p>
                  {k.videoUrl && <button onClick={() => setVideo(k.videoUrl)} className="mx-auto mt-auto rounded-sm bg-ihgreen px-8 py-1.5 font-head text-xs font-bold text-white hover:brightness-110">Watch Video</button>}
                </article>
              );
            })}
          </div>
          <button onClick={() => slide(1)} aria-label="Next" className="absolute -right-9 top-1/2 z-10 hidden -translate-y-1/2 text-[#777] hover:text-black lg:block"><ChevronsRight className="h-7 w-7" /></button>
        </div>
        {pages > 1 && <div className="flex justify-center gap-2">{Array.from({ length: pages }).map((_, i) => <button key={i} onClick={() => goto(i)} aria-label={`Page ${i + 1}`} aria-current={i === page} className={`h-2 w-2 rounded-full ${i === page ? 'bg-ihyellow' : 'bg-[#c9c9c9]'}`} />)}</div>}
        {clips.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {clips.map((k) => <ImageBox key={k.title} src={PHOTOS.snow3?.(500)} hue={200} alt={k.title} className="aspect-video w-[220px] rounded-xl"><div className="absolute inset-0 bg-black/40" /><p className="absolute inset-x-3 bottom-3 font-head text-sm font-extrabold uppercase leading-tight text-white">{k.title}</p><PlayButton onClick={() => setVideo(k.videoUrl)} /></ImageBox>)}
          </div>
        )}
      </div>
      {video && <VideoModal url={video} onClose={() => setVideo('')} />}
    </section>
  );
}

function Values() {
  return (
    <section className="py-10">
      <div className={wrap}>
        <HomeHeading title="Our Core Values: What Makes Us Who We Are" gray />
        <div className="gap-x-16 md:columns-2">
          {about.values.map((v) => (
            <div key={v.title} className="mb-6 break-inside-avoid">
              <h3 className="mb-2 font-serif text-[27px] font-normal leading-tight text-black sm:text-[28px]">{v.title}</h3>
              {v.paras.map((p, i) => <p key={i} className="mb-3 font-serif text-[13.5px] leading-snug text-black">{p}</p>)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trail() {
  const t = about.trail;
  const [video, setVideo] = useState('');
  return (
    <section className="py-10">
      <div className={wrap}>
        <HomeHeading title={t.title} right={t.right} gray />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((it) => (
            <article key={it.title} className="overflow-hidden rounded bg-white shadow-[0_2px_8px_rgba(0,0,0,0.22)]">
              <ImageBox src={PHOTOS[it.photo]?.(700)} hue={200} alt={it.title} className="h-[200px]">
                {it.videoUrl && <PlayButton onClick={() => setVideo(it.videoUrl)} label={`Play: ${it.title}`} />}
              </ImageBox>
              <div className="p-4">
                <h3 className="border-l-[3px] border-ihyellow pl-2.5 font-serif text-[15px] font-bold leading-snug text-black">{it.title}</h3>
                <p className="mt-3 font-serif text-[12.5px] leading-snug text-black">{it.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      {video && <VideoModal url={video} onClose={() => setVideo('')} />}
    </section>
  );
}

export default function About() {
  return (
    <>
      <Hero />
      <Vision />
      <Known />
      <Values />
      <Trail />
      <section className="py-10 text-center">
        <Link to="/explorations" className="inline-block rounded-sm bg-ihyellow px-7 py-2.5 font-head text-sm font-bold text-black shadow hover:brightness-95">Read Our Explorations</Link>
      </section>
    </>
  );
}