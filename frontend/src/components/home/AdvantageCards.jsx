import { ShieldCheck, ClipboardList, Users, Handshake, Leaf, Backpack } from 'lucide-react';
import { advantages } from '../../data/home';
import { HomeHeading } from './primitives';

const ICONS = { ShieldCheck, ClipboardList, Users, Handshake, Leaf, Backpack };

export default function AdvantageCards() {
  return (
    <section className="py-10 sm:py-14">
      <div className="container">
        <HomeHeading title="The Unofficial Trek Advantage." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-4">
          {advantages.map((a) => {
            const Icon = ICONS[a.icon] || ShieldCheck;
            return (
              <article key={a.id} className="rounded-xl bg-white p-5 shadow-[0_3px_14px_rgba(0,0,0,0.13)]">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-[15px] font-bold leading-snug text-black">{a.title}</h3>
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${a.tone === 'gold' ? 'bg-ihgold' : 'bg-ihlime'}`}><Icon className="h-5 w-5 text-[#3b3b1f]" strokeWidth={1.6} /></span>
                </div>
                <p className="mt-3 font-serif text-[13px] leading-snug text-black">{a.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}