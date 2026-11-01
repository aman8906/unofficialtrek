import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ImageBox } from '../ui';
import { PHOTOS } from '../../data/images';
import { HomeHeading } from '../home/primitives';
import { useScrollDots } from './hooks';

// Big image tiles with a title on them. A tile either links (`to`) or runs `onPick`.
export default function TileCarousel({ id, title, right, tiles, onPick }) {
  const track = useRef(null);
  const { pages, page, goto } = useScrollDots(track, tiles.length);
  return (
    <section id={`sec-${id}`} className="scroll-mt-36 py-7">
      <HomeHeading title={title} right={right} />
      <div ref={track} className="flex snap-x gap-6 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] sm:gap-10 [&::-webkit-scrollbar]:hidden">
        {tiles.map((t) => {
          const inner = (
            <ImageBox src={PHOTOS[t.photo]?.(700)} hue={170} alt={t.title} className="h-[200px] w-[238px] shrink-0 sm:h-[220px]">
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent transition group-hover:from-black/70" />
              <p className="absolute inset-x-4 bottom-4 font-head text-[20px] font-semibold leading-tight text-white drop-shadow sm:text-[22px]">{t.title}</p>
            </ImageBox>
          );
          return t.to
            ? <Link key={t.title} to={t.to} className="group snap-start">{inner}</Link>
            : <button key={t.title} onClick={() => onPick?.(t)} className="group snap-start text-left">{inner}</button>;
        })}
      </div>
      {pages > 1 && (
        <div className="mt-1 flex justify-center gap-2">
          {Array.from({ length: pages }).map((_, i) => <button key={i} onClick={() => goto(i)} aria-label={`Page ${i + 1}`} aria-current={i === page} className={`h-2 w-2 rounded-full ${i === page ? 'bg-black' : 'bg-[#c9c9c9]'}`} />)}
        </div>
      )}
    </section>
  );
}