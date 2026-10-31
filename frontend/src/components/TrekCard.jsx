import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Clock, Mountain, MapPin, Heart } from 'lucide-react';
import { USE_MOCK } from '../services/api';
import { useUserAuth } from '../user/UserAuth';
import { Badge, ImageBox, Rupee } from './ui';
import { trekImage } from '../data/images';

const toneFor = { Easy: 'green', 'Easy-Moderate': 'green', Moderate: 'amber', 'Moderate-Difficult': 'amber', Difficult: 'red' };

export default function TrekCard({ trek }) {
  const { user, wish, toggleWish } = useUserAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const liked = wish.some((t) => t.id === trek.id);
  const onHeart = async () => {
    if (!user) return nav('/login', { state: { from: loc.pathname } });
    try { await toggleWish(trek.id); } catch { /* ignore */ }
  };
  return (
    <div className="relative h-full">
    <Link to={`/treks/${trek.slug}`} className="card group flex h-full flex-col overflow-hidden">
      <ImageBox src={trekImage(trek, 700)} hue={trek.hue} alt={trek.title} className="h-48 sm:h-52">
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {(trek.seasons || []).slice(0, 3).map((s) => <Badge key={s}><span className="capitalize">{s}</span></Badge>)}
        </div>
      </ImageBox>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <Badge tone={toneFor[trek.difficulty] || 'grey'}>{trek.difficulty}</Badge>
          <span className="flex items-center gap-1 text-xs"><MapPin className="h-3.5 w-3.5" />{trek.region}</span>
        </div>
        <h3 className="mb-2 group-hover:text-brand">{trek.title}</h3>
        <p className="mb-4 line-clamp-2 text-sm">{trek.shortDesc}</p>
        <div className="mt-auto flex items-center justify-between border-t border-line pt-4 text-sm">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-brand" />{trek.days} days</span>
            <span className="flex items-center gap-1"><Mountain className="h-4 w-4 text-brand" />{Number(trek.altitude).toLocaleString('en-IN')} ft</span>
          </span>
          <span className="font-heading font-semibold text-ink"><Rupee value={trek.price} /></span>
        </div>
      </div>
    </Link>
    {!USE_MOCK && (
      <button onClick={onHeart} aria-label={liked ? 'Remove from wishlist' : 'Save to wishlist'} aria-pressed={liked} className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow transition hover:scale-105">
        <Heart className={`h-5 w-5 ${liked ? 'fill-red-500 text-red-500' : 'text-ink'}`} />
      </button>
    )}
    </div>
  );
}