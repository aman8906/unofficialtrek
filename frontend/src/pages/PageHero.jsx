import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ImageBox } from '../components/ui';

export default function PageHero({ title, sub, hue = 155, crumbs = [], image }) {
  return (
    <section className="relative isolate overflow-hidden text-white">
      <ImageBox src={image} hue={hue} eager className="absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/65 via-black/40 to-black/20" />
      <div className="container py-16 sm:py-24">
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-white/80">
          <Link to="/" className="hover:text-white">Home</Link>
          {crumbs.map(([label, to]) => (<span key={label} className="flex items-center gap-1"><ChevronRight className="h-4 w-4" />{to ? <Link to={to} className="hover:text-white">{label}</Link> : label}</span>))}
        </nav>
        <h1 className="max-w-3xl text-white drop-shadow-sm">{title}</h1>
        {sub && <p className="mt-4 max-w-2xl text-base text-white/90 sm:text-lg">{sub}</p>}
      </div>
    </section>
  );
}