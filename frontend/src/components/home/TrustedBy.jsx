import { trustedBy } from '../../data/home';
import { HomeHeading } from './primitives';

// Shows logos when an item has { name, logo }. Plain names are shown as text tiles until real logos are added.
export default function TrustedBy() {
  return (
    <section className="py-10 sm:py-14">
      <div className="container">
        <HomeHeading title="Trusted by" />
        <ul className="mx-auto flex max-w-[1100px] flex-wrap justify-center gap-x-8 gap-y-6">
          {trustedBy.map((p) => {
            const item = typeof p === 'string' ? { name: p } : p;
            return (
              <li key={item.name} className="grid h-14 w-[120px] place-items-center sm:w-[140px]">
                {item.logo
                  ? <img src={item.logo} alt={item.name} loading="lazy" className="max-h-12 max-w-full object-contain grayscale transition hover:grayscale-0" />
                  : <span className="text-center font-head text-[12px] font-bold uppercase leading-tight tracking-wide text-[#6b6b6b]">{item.name}</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}