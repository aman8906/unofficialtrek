import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageBox } from '../ui';
import { PHOTOS } from '../../data/images';
import { heroSlides } from '../../data/home';

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = heroSlides.length;
  useEffect(() => {
    if (paused) return undefined;
    const t = setInterval(() => setI((x) => (x + 1) % n), 6500);
    return () => clearInterval(t);
  }, [paused, n]);
  const go = (d) => setI((x) => (x + d + n) % n);
  const s = heroSlides[i];

  return (
    <section className="relative isolate overflow-hidden bg-black text-white" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carousel">
      {heroSlides.map((sl, k) => (
        <div key={sl.id} aria-hidden={k !== i} className={`absolute inset-0 -z-10 transition-opacity duration-700 ${k === i ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
          <ImageBox src={PHOTOS[sl.photo]?.(1800)} hue={sl.hue} eager={k === 0} className="absolute inset-0" />
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-black/10" />
        </div>
      ))}
      <div className="container flex min-h-[460px] items-center py-14 sm:min-h-[500px] lg:min-h-[540px]">
        <div key={s.id} className="max-w-[640px] animate-fade-up px-6 sm:px-10">
          <h1 className="font-serif text-[32px] font-bold leading-[1.15] text-white sm:text-[44px] lg:text-[54px]">{s.title}</h1>
          <p className="mt-6 max-w-[600px] font-head text-[16px] font-semibold leading-snug text-white sm:text-[18px]">{s.text}</p>
          <Link to={s.cta.to} className="mt-8 inline-block rounded-md bg-ihyellow px-6 py-3 font-head text-sm font-semibold text-black shadow-[0_3px_8px_rgba(0,0,0,0.35)] transition hover:brightness-95">{s.cta.label}</Link>
          <p className="mt-6"><Link to={s.link.to} className="font-head text-[17px] font-bold leading-snug text-white underline underline-offset-4 sm:text-[19px]">{s.link.label}</Link></p>
        </div>
      </div>
      <button onClick={() => go(-1)} aria-label="Previous slide" className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white transition hover:bg-black/60 sm:left-5"><ChevronLeft className="h-6 w-6" /></button>
      <button onClick={() => go(1)} aria-label="Next slide" className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white transition hover:bg-black/60 sm:right-5"><ChevronRight className="h-6 w-6" /></button>
      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
        {heroSlides.map((sl, k) => <button key={sl.id} onClick={() => setI(k)} aria-label={`Go to slide ${k + 1}`} aria-current={k === i} className={`h-2 rounded-full transition-all ${k === i ? 'w-6 bg-ihyellow' : 'w-2 bg-white/60'}`} />)}
      </div>
    </section>
  );
}