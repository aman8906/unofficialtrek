import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ArrowLeftRight } from 'lucide-react';
import { seasons } from '../../data/mock';
import { MONTHS, DIFFICULTIES, DURATIONS } from '../../data/upcoming';

const H = ({ children }) => <h3 className="mb-3 inline-block border-b-2 border-[#ffcc00] pb-0.5 font-head text-[20px] font-extrabold leading-tight text-[#0a0a0a]">{children}</h3>;

function Group({ title, children }) {
  return (
    <div className="mb-6">
      <p className="mb-2 inline-block border-b-2 border-[#ffcc00] pb-0.5 font-serif text-[15px] font-medium text-[#222]">{title}</p>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}
const Item = ({ active, onClick, children }) => (
  <li><button onClick={onClick} aria-pressed={active} className={`text-left font-head text-[12px] leading-snug text-black hover:underline ${active ? 'font-bold underline' : ''}`}>{children}</button></li>
);

// Left cream column: date range, compare link and category filters
export default function Sidebar({ filters, pick, range, setRange, regions, onCompare }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(range);
  const label = range.from || range.to ? `${range.from || '…'} to ${range.to || '…'}` : 'Select Date Range';
  const apply = () => { setRange(draft); setOpen(false); };
  const clear = () => { setDraft({ from: '', to: '' }); setRange({ from: '', to: '' }); setOpen(false); };

  return (
    <div className="px-5 py-5 lg:px-6">
      <H>Filter By Date</H>
      <div className="relative mb-3">
        <button onClick={() => { setDraft(range); setOpen(!open); }} aria-expanded={open} className="flex h-9 w-full items-center justify-between rounded-lg border border-[#ced4da] bg-white px-3 text-left font-head text-[11.5px] font-semibold text-[#555]">
          <span className={range.from || range.to ? 'text-black' : ''}>{label}</span><CalendarDays className="h-4 w-4 text-black" />
        </button>
        {open && (
          <div className="absolute inset-x-0 top-full z-20 mt-1 rounded-lg border border-[#ced4da] bg-white p-3 shadow-lg">
            <label className="mb-1 block text-[11px] font-semibold">From</label>
            <input type="date" value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} className="mb-2 h-9 w-full rounded border border-[#ced4da] px-2 text-xs" />
            <label className="mb-1 block text-[11px] font-semibold">To</label>
            <input type="date" value={draft.to} min={draft.from} onChange={(e) => setDraft({ ...draft, to: e.target.value })} className="mb-3 h-9 w-full rounded border border-[#ced4da] px-2 text-xs" />
            <div className="flex gap-2"><button onClick={apply} className="flex-1 rounded-sm bg-ihyellow py-1.5 font-head text-xs font-bold">Apply</button><button onClick={clear} className="flex-1 rounded-sm border border-[#ced4da] py-1.5 font-head text-xs font-bold">Clear</button></div>
          </div>
        )}
      </div>
      <button onClick={onCompare} className="mb-6 flex items-center gap-1.5 text-[12.5px] text-ihlink underline"><ArrowLeftRight className="h-3.5 w-3.5" />Compare Treks</button>

      <H>Filter By Categories</H>
      <div className="mt-2">
        <Group title="Treks by Month">{MONTHS.map((m) => <Item key={m} active={filters.month === m} onClick={() => pick('month', m)}>{m}</Item>)}</Group>
        <Group title="Treks by Difficulty">{DIFFICULTIES.map((d) => <Item key={d} active={filters.difficulty === d} onClick={() => pick('difficulty', d)}>{d.replace('-', ' - ')}</Item>)}</Group>
        <Group title="Treks by Activity">
          <Item active={false} onClick={() => pick('clear')}>Trekking</Item>
          <li><Link to="/rafting" className="font-head text-[12px] text-black hover:underline">Rafting</Link></li>
          <li><Link to="/bungee-jumping" className="font-head text-[12px] text-black hover:underline">Bungee Jumping</Link></li>
          <li><Link to="/villages" className="font-head text-[12px] text-black hover:underline">Village Culture Treks &amp; Experience</Link></li>
        </Group>
        <Group title="Treks by Season">{seasons.map((s) => <Item key={s.id} active={filters.season === s.id} onClick={() => pick('season', s.id)}>{s.label}</Item>)}</Group>
        <Group title="Treks by Duration">{DURATIONS.map((d) => <Item key={d} active={filters.days === d} onClick={() => pick('days', d)}>{d} days</Item>)}</Group>
        <Group title="Treks by Region">{(regions.length ? regions : ['Uttarakhand']).map((r) => <Item key={r} active={filters.region === r} onClick={() => pick('region', r)}>{r}</Item>)}</Group>
      </div>
    </div>
  );
}