import { Link } from 'react-router-dom';
import { trekImage } from '../../data/images';
import { ImageBox } from '../ui';
import { WishHeart } from '../home/primitives';

const Dot = () => <span className="mx-1.5 inline-block h-1 w-1 bg-ihyellow align-middle" />;
const badgeColor = (b) => (/founder/i.test(b) ? 'bg-[#003099] text-white' : /popular|trending/i.test(b) ? 'bg-[#881127] text-white' : 'bg-[#ffcc00] text-black');

// Trek card used in every carousel and in the filter results.
export default function TrekTile({ t, onDates, full = false }) {
  return (
    <article className={`flex shrink-0 snap-start flex-col overflow-hidden rounded bg-white shadow-[0_1px_5px_rgba(0,0,0,0.25)] ${full ? 'w-full' : 'w-[200px]'}`}>
      <ImageBox src={trekImage(t, 500)} hue={t.hue} alt={t.title} className="h-[120px] border-b-2 border-ihyellow">
        {t.badge && <span className={`absolute -left-1 -top-1 grid h-[50px] w-[50px] -rotate-[18deg] place-items-center rounded-full p-1 text-center font-head text-[9px] font-extrabold leading-[1.05] ${badgeColor(t.badge)}`}>{t.badge}</span>}
        <WishHeart trekId={t.id} className="absolute right-2 top-2" />
      </ImageBox>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
        <p className="text-[10px] text-[#555]">{t.days} Days<Dot />{t.difficulty}<Dot />{Number(t.altitude).toLocaleString('en-IN')} ft</p>
        <h3 className="mt-3 font-head text-[13.5px] font-bold uppercase leading-tight text-[#222]">{t.title} Trek</h3>
        <p className="mt-1.5 line-clamp-3 font-serif text-[13.5px] leading-snug text-black">{t.shortDesc}</p>
        <div className="mt-auto flex gap-2 pt-2.5">
          <Link to={`/treks/${t.slug}`} className="rounded-sm bg-ihgreen px-2.5 py-1.5 font-head text-[10.5px] font-bold text-white hover:brightness-110">Get Trek Info</Link>
          <button onClick={() => onDates?.(t)} className="rounded-sm bg-ihyellow px-2.5 py-1.5 font-head text-[10.5px] font-bold text-black hover:brightness-95">View Dates</button>
        </div>
      </div>
    </article>
  );
}