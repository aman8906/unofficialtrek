import { useEffect, useState } from 'react';

// page dots for a horizontally scrolling row
export function useScrollDots(ref, dep) {
  const [st, setSt] = useState({ pages: 1, page: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const calc = () => {
      const pages = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth - 0.05));
      setSt({ pages, page: Math.min(pages - 1, Math.round(el.scrollLeft / el.clientWidth)) });
    };
    calc();
    el.addEventListener('scroll', calc, { passive: true });
    window.addEventListener('resize', calc);
    return () => { el.removeEventListener('scroll', calc); window.removeEventListener('resize', calc); };
  }, [ref, dep]);
  const goto = (i) => ref.current?.scrollTo({ left: i * ref.current.clientWidth, behavior: 'smooth' });
  return { ...st, goto };
}