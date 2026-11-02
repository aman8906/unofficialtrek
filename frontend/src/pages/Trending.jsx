import { useState } from 'react';
import { getTreks } from '../services/api';
import { useAsync } from '../lib/hooks';
import { Skeleton } from '../components/ui';
import { HomeHeading } from '../components/home/primitives';
import TrekTile from '../components/upcoming/TrekTile';
import { DatesModal } from '../components/upcoming/Modals';

export default function Trending() {
  const { data, loading } = useAsync(() => getTreks(), []);
  const [datesFor, setDatesFor] = useState(null);
  const list = (data || []).filter((t) => t.badge || t.isFeatured);
  return (
    <>
      <section className="bg-ihbar/60 py-10 text-center">
        <h1 className="font-head text-[30px] font-extrabold text-black sm:text-[36px] lg:text-[40px]">Trending Treks</h1>
        <p className="mx-auto mt-2 max-w-xl px-4 text-sm text-black">The Uttarakhand treks our trekkers talk about the most, and the ones that fill up fast.</p>
      </section>
      <section className="py-9"><div className="mx-auto max-w-[1060px] px-4 sm:px-6">
        <HomeHeading title="Popular & Trending" />
        {loading ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-72" />)}</div>
          : !list.length ? <p className="rounded border border-dashed border-[#ccc] p-8 text-center text-sm">No trending treks yet. In Admin, set a badge or mark treks as featured.</p>
          : <div className="grid justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-4">{list.map((t) => <TrekTile key={t.id} t={t} full onDates={setDatesFor} />)}</div>}
      </div></section>
      {datesFor && <DatesModal trek={datesFor} onClose={() => setDatesFor(null)} />}
    </>
  );
}