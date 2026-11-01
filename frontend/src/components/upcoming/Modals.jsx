import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, CalendarDays } from 'lucide-react';
import { getBatches } from '../../services/api';
import { useAsync } from '../../lib/hooks';
import { Rupee, Skeleton } from '../ui';

const Shell = ({ title, onClose, children, wide }) => (
  <div className="fixed inset-0 z-[60] grid place-items-center bg-black/55 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
    <div className={`relative max-h-[90vh] w-full overflow-y-auto rounded-lg bg-white p-5 shadow-xl sm:p-6 ${wide ? 'max-w-3xl' : 'max-w-md'}`} onClick={(e) => e.stopPropagation()}>
      <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100"><X className="h-5 w-5" /></button>
      <h3 className="mb-4 pr-8 font-head text-lg font-extrabold text-black">{title}</h3>
      {children}
    </div>
  </div>
);

// "View Dates": open batches of one trek
export function DatesModal({ trek, onClose }) {
  const { data, loading } = useAsync(() => getBatches(trek.title), [trek.title]);
  return (
    <Shell title={`${trek.title} Trek: upcoming dates`} onClose={onClose}>
      {loading ? <Skeleton className="h-24" /> : !data?.length ? (
        <div className="text-sm"><p className="mb-4">No open dates right now. Send us an enquiry and we will tell you when the next batch opens.</p><Link to="/contact" onClick={onClose} className="inline-block rounded-sm bg-ihyellow px-5 py-2 font-head text-xs font-bold text-black">Send an enquiry</Link></div>
      ) : (
        <ul className="space-y-3">{data.map((b) => (
          <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded border border-[#e3e3e3] p-3">
            <div><p className="flex items-center gap-2 text-sm font-semibold text-black"><CalendarDays className="h-4 w-4 text-ihgreen" />{b.startDate} to {b.endDate}</p>
              <p className={`mt-1 text-xs ${b.seatsLeft < 5 ? 'font-semibold text-red-600' : ''}`}>{b.seatsLeft} seats left · <Rupee value={trek.price} /> per person</p></div>
            <Link to={`/treks/${trek.slug}`} onClick={onClose} className="rounded-sm bg-ihgreen px-4 py-2 font-head text-xs font-bold text-white hover:brightness-110">Register</Link>
          </li>))}</ul>
      )}
    </Shell>
  );
}

// "Compare Treks": 2 or 3 treks side by side
export function CompareModal({ treks, onClose }) {
  const [ids, setIds] = useState(['', '', '']);
  const picked = ids.map((id) => treks.find((t) => t.id === id)).filter(Boolean);
  const rows = [
    ['Region', (t) => t.region], ['Duration', (t) => `${t.days} days`], ['Difficulty', (t) => t.difficulty],
    ['Max altitude', (t) => `${Number(t.altitude).toLocaleString('en-IN')} ft`], ['Best seasons', (t) => (t.seasons || []).join(', ')],
    ['Price', (t) => `₹${Number(t.price).toLocaleString('en-IN')}`],
  ];
  return (
    <Shell title="Compare treks" onClose={onClose} wide>
      <div className="grid gap-3 sm:grid-cols-3">
        {ids.map((id, k) => (
          <select key={k} value={id} onChange={(e) => setIds(ids.map((x, j) => (j === k ? e.target.value : x)))} aria-label={`Trek ${k + 1}`} className="h-10 rounded-lg border border-[#ced4da] bg-white px-3 text-sm">
            <option value="">Choose trek {k + 1}</option>{treks.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        ))}
      </div>
      {picked.length < 2 ? <p className="mt-5 text-sm">Pick at least two treks to compare.</p> : (
        <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[480px] text-left text-sm">
          <thead><tr><th className="w-28 p-2" />{picked.map((t) => <th key={t.id} className="p-2 font-head font-extrabold text-black">{t.title}</th>)}</tr></thead>
          <tbody>{rows.map(([label, fn]) => <tr key={label} className="border-t border-[#e8e8e8]"><td className="p-2 text-xs font-semibold uppercase text-[#666]">{label}</td>{picked.map((t) => <td key={t.id} className="p-2 capitalize text-black">{fn(t)}</td>)}</tr>)}
            <tr className="border-t border-[#e8e8e8]"><td />{picked.map((t) => <td key={t.id} className="p-2"><Link to={`/treks/${t.slug}`} onClick={onClose} className="rounded-sm bg-ihgreen px-3 py-1.5 font-head text-[11px] font-bold text-white">Get Trek Info</Link></td>)}</tr></tbody>
        </table></div>
      )}
    </Shell>
  );
}