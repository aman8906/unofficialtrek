import { Heart, Play, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { USE_MOCK } from '../../services/api';
import { useUserAuth } from '../../user/UserAuth';

// Heavy heading with the thin yellow line under it (and optional small text on the right)
export function HomeHeading({ title, right, gray = false }) {
  return (
    <div className={`mb-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-2 border-b pb-3 ${gray ? 'border-[#c9c9c9]' : 'border-ihyellow'}`}>
      <h2 className="font-head text-[24px] font-extrabold leading-tight tracking-[-0.015em] text-black sm:text-[28px] lg:text-[31px]">{title}</h2>
      {right && <p className="max-w-xl text-[13px] leading-snug text-black">{right}</p>}
    </div>
  );
}

export const PlayButton = ({ onClick, label = 'Play video' }) => (
  <button onClick={onClick} aria-label={label} className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ihplay text-white shadow-lg transition hover:scale-110">
    <Play className="h-5 w-5 fill-current" />
  </button>
);

const ytId = (u = '') => u.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1];

export function VideoModal({ url, onClose }) {
  const id = ytId(url);
  if (!id) { window.open(url, '_blank', 'noopener'); onClose(); return null; }
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/80 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label="Video">
      <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close video" className="absolute -top-10 right-0 text-white"><X className="h-7 w-7" /></button>
        <div className="aspect-video overflow-hidden rounded-lg bg-black">
          <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`} title="Video" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        </div>
      </div>
    </div>
  );
}

// Round white heart button for treks (needs the real backend; hidden in demo mode)
export function WishHeart({ trekId, className = '' }) {
  const { user, wish, toggleWish } = useUserAuth();
  const nav = useNavigate();
  const loc = useLocation();
  if (USE_MOCK) return null;
  const liked = wish.some((t) => t.id === trekId);
  const click = async () => {
    if (!user) return nav('/login', { state: { from: loc.pathname } });
    try { await toggleWish(trekId); } catch { /* ignore */ }
  };
  return (
    <button onClick={click} aria-label={liked ? 'Remove from wishlist' : 'Save to wishlist'} aria-pressed={liked} className={`grid h-8 w-8 place-items-center rounded-full bg-white shadow transition hover:scale-110 ${className}`}>
      <Heart className={`h-[18px] w-[18px] ${liked ? 'fill-red-500 text-red-500' : 'text-black'}`} />
    </button>
  );
}