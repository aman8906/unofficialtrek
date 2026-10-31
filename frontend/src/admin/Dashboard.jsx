import { useEffect, useState } from 'react';
import { Mountain, Ticket, MessageSquare, IndianRupee } from 'lucide-react';
import { readStore } from '../lib/store';
import { resources } from './resources';
import { Badge, Rupee, Skeleton } from '../components/ui';
import { USE_MOCK } from '../services/api';
import { adminApi, errMsg } from '../services/adminApi';

const seed = (k) => resources.find((r) => r.key === k).seed;
const tone = { confirmed: 'green', pending: 'amber', cancelled: 'red' };

function fromLocal() {
  const treks = readStore('admin:treks', seed('treks'));
  const bookings = readStore('admin:bookings', seed('bookings'));
  const enquiries = readStore('admin:enquiries', seed('enquiries'));
  const byStatus = { pending: 0, confirmed: 0, cancelled: 0 };
  bookings.forEach((b) => { byStatus[b.status] = (byStatus[b.status] || 0) + 1; });
  return {
    treksLive: treks.filter((t) => t.published !== false).length, bookings: bookings.length,
    newEnquiries: enquiries.filter((e) => !e.replied).length,
    revenue: bookings.filter((b) => b.status === 'confirmed').reduce((s, b) => s + Number(b.amount || 0), 0),
    byStatus, recent: bookings.slice(0, 5),
  };
}

export default function Dashboard() {
  const [st, setSt] = useState(USE_MOCK ? fromLocal() : null);
  const [err, setErr] = useState('');
  useEffect(() => { if (!USE_MOCK) adminApi.dashboard().then(setSt).catch((e) => setErr(errMsg(e))); }, []);
  if (err) return <p role="alert" className="rounded-card bg-red-50 p-4 text-red-700">{err}</p>;
  if (!st) return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}</div>;

  const stats = [[Mountain, 'Treks live', st.treksLive], [Ticket, 'Bookings', st.bookings], [MessageSquare, 'New enquiries', st.newEnquiries], [IndianRupee, 'Confirmed revenue', <Rupee key="r" value={st.revenue} />]];
  const rows = ['pending', 'confirmed', 'cancelled'].map((s) => [s, st.byStatus[s] || 0]);
  const max = Math.max(1, ...rows.map(([, n]) => n));
  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl sm:text-3xl lg:text-3xl">Dashboard</h1><p className="mt-1 text-sm">What is happening on the site today.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([Icon, label, val]) => (<div key={label} className="flex items-center gap-4 rounded-card bg-white p-5 shadow-card"><span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-light text-brand"><Icon className="h-6 w-6" /></span><div><p className="text-sm">{label}</p><p className="font-heading text-2xl font-bold text-ink">{val}</p></div></div>))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-card bg-white p-5 shadow-card"><h3 className="mb-4 text-base">Bookings by status</h3>
          <div className="flex h-40 items-end gap-4">{rows.map(([s, n]) => (<div key={s} className="flex flex-1 flex-col items-center gap-2"><span className="text-sm font-medium text-ink">{n}</span><div className="w-full rounded-t-lg bg-brand" style={{ height: `${(n / max) * 100}%`, minHeight: 6 }} /><span className="text-xs capitalize">{s}</span></div>))}</div></div>
        <div className="overflow-x-auto rounded-card bg-white p-5 shadow-card lg:col-span-2"><h3 className="mb-4 text-base">Recent bookings</h3>
          <table className="w-full min-w-[480px] text-left text-sm"><thead className="text-xs"><tr><th className="pb-2">Name</th><th className="pb-2">Item</th><th className="pb-2">Date</th><th className="pb-2">Status</th></tr></thead>
            <tbody>{st.recent.map((b) => <tr key={b.id} className="border-t border-line"><td className="py-2.5 font-medium text-ink">{b.name}</td><td>{b.item}</td><td>{b.date || '-'}</td><td><Badge tone={tone[b.status]}>{b.status}</Badge></td></tr>)}
              {!st.recent.length && <tr><td colSpan="4" className="py-6 text-center">No bookings yet.</td></tr>}</tbody></table></div>
      </div>
    </div>
  );
}
