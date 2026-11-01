import { useRef } from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { HomeHeading } from '../home/primitives';
import TrekTile from './TrekTile';
import { useScrollDots } from './hooks';

// Heading + text on the right + row of trek cards with « » arrows and page dots
export default function TrekCarousel({ id, title, right, treks, onDates }) {
  const track = useRef(null);
  const { pages, page, goto } = useScrollDots(track, treks.length);
  const slide = (d) => track.current?.scrollBy({ left: d * 216, behavior: 'smooth' });
  if (!treks.length) return null;
  return (
    <section id={`sec-${id}`} className="scroll-mt-36 py-7">
      <HomeHeading title={title} right={right} />
      <div className="relative">
        <button onClick={() => slide(-1)} aria-label="Previous treks" className="absolute -left-7 top-[42%] z-10 hidden text-[#777] hover:text-black xl:block"><ChevronsLeft className="h-7 w-7" /></button>
        <div ref={track} className="flex snap-x gap-4 overflow-x-auto scroll-smooth px-1 pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {treks.map((t) => <TrekTile key={t.id} t={t} onDates={onDates} />)}
        </div>
        <button onClick={() => slide(1)} aria-label="Next treks" className="absolute -right-7 top-[42%] z-10 hidden text-[#777] hover:text-black xl:block"><ChevronsRight className="h-7 w-7" /></button>
      </div>
      {pages > 1 && (
        <div className="mt-1 flex justify-center gap-2">
          {Array.from({ length: pages }).map((_, i) => <button key={i} onClick={() => goto(i)} aria-label={`Page ${i + 1}`} aria-current={i === page} className={`h-2 w-2 rounded-full ${i === page ? 'bg-ihyellow' : 'bg-[#c9c9c9]'}`} />)}
        </div>
      )}
    </section>
  );
}