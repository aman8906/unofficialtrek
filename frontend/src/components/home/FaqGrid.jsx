import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getFaqs } from '../../services/api';
import { useAsync } from '../../lib/hooks';
import { HomeHeading } from './primitives';

function Item({ f }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-[3px] border border-[#dedede] bg-ihfaq shadow-[0_2px_0_#cfcfcf]">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left">
        <span className="font-head text-[13px] font-medium leading-snug text-black">{f.question}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden"><p className="border-t border-[#e6e6e6] bg-white px-3.5 py-3 font-serif text-[13.5px] leading-relaxed text-black">{f.answer}</p></div>
      </div>
    </div>
  );
}

export default function FaqGrid() {
  const { data } = useAsync(() => getFaqs(), []);
  const [all, setAll] = useState(false);
  const list = data || [];
  const shown = all ? list : list.slice(0, 10);
  const half = Math.ceil(shown.length / 2);
  const cols = [shown.slice(0, half), shown.slice(half)];
  if (!list.length) return null;
  return (
    <section className="py-10 sm:py-14">
      <div className="container">
        <HomeHeading title="Frequently Asked Questions" />
        <div className="grid items-start gap-x-6 gap-y-3 md:grid-cols-2">
          {cols.map((col, k) => <div key={k} className="space-y-2.5">{col.map((f) => <Item key={f.id} f={f} />)}</div>)}
        </div>
        {list.length > 10 && !all && (
          <div className="mt-6 text-center"><button onClick={() => setAll(true)} className="rounded-sm bg-ihyellow px-7 py-2 font-head text-xs font-bold text-black shadow hover:brightness-95">View More FAQs</button></div>
        )}
      </div>
    </section>
  );
}