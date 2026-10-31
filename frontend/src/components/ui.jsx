import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Image with graceful fallback
export function ImageBox({
  src,
  hue = 150,
  className = '',
  children,
  alt = '',
  eager = false,
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(165deg, hsl(${hue} 42% 38%), hsl(${hue} 52% 16%))`,
      }}
      role={src && !failed ? undefined : 'img'}
      aria-label={src && !failed ? undefined : alt}
    >
      {(!src || failed || !loaded) && (
        <svg
          className="absolute inset-x-0 bottom-0 h-3/5 w-full"
          viewBox="0 0 400 160"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon
            points="0,160 0,110 60,60 110,100 170,30 240,105 290,70 345,110 400,80 400,160"
            fill="rgba(255,255,255,.14)"
          />
          <polygon
            points="0,160 0,135 80,95 140,130 210,80 280,132 340,100 400,130 400,160"
            fill="rgba(0,0,0,.22)"
          />
        </svg>
      )}

      {src && !failed && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {children}
    </div>
  );
}

export function SectionHeading({ title, subtitle, center = false }) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <h2 className={`heading-underline ${center ? 'center' : ''}`}>
        {title}
      </h2>

      {subtitle && (
        <p className="-mt-4 mb-8 text-base sm:text-lg">{subtitle}</p>
      )}
    </div>
  );
}

export function Badge({ children, tone = 'light' }) {
  const tones = {
    light: 'bg-white/90 text-brand',
    brand: 'bg-brand-light text-brand',
    accent: 'bg-accent/10 text-accent-dark',
    green: 'bg-emerald-100 text-emerald-800',
    red: 'bg-red-100 text-red-700',
    amber: 'bg-amber-100 text-amber-800',
    grey: 'bg-slate-100 text-slate-700',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        tones[tone] || tones.light
      }`}
    >
      {children}
    </span>
  );
}

export function Accordion({ items, defaultOpen = 0 }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-white">
      {items.map((it, i) => {
        const isOpen = open === i;

        return (
          <div key={it.id || i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-6"
            >
              <span className="font-heading text-base font-medium text-ink sm:text-lg">
                {it.title}
              </span>

              <ChevronDown
                className={`h-5 w-5 shrink-0 text-brand transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-5 text-[15px] leading-relaxed sm:px-6">
                  {it.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-card bg-slate-200/70 ${className}`}
    />
  );
}

export function Rupee({ value }) {
  return <>₹{Number(value || 0).toLocaleString('en-IN')}</>;
}