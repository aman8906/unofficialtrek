import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Users } from 'lucide-react';
import { useUserAuth } from '../../user/UserAuth';
import { Badge, Rupee } from '../../components/ui';
import { DashHeading, SectionTitle } from './DashboardLayout';

const tone = { confirmed: 'green', pending: 'amber', cancelled: 'red' };
const today = () => new Date().toISOString().slice(0, 10);
const isPrevious = (b) => b.status === 'cancelled' || (b.date && b.date < today());

export default function Trips({ mode }) {
  const { myBookings } = useUserAuth();
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { myBookings().then(setRows).catch((e) => { setErr(e.message); setRows([]); }); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const prev = mode === 'previous';
  const list = rows?.filter((b) => (prev ? isPrevious(b) : !isPrevious(b)));

  return (
    <>
      <DashHeading sub={prev ? 'Your completed and cancelled bookings.' : 'Your bookings that are coming up.'} />
      <SectionTitle>{prev ? 'Previous treks' : 'Upcoming treks'}</SectionTitle>
      {err && <p role="alert" className="mb-4 text-sm text-red-600">{err}</p>}
      {!rows ? <p className="text-sm">Loading...</p> : !list.length ? (
        <div className="rounded bg-white p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
          <p className="mb-4 text-sm">{prev ? 'No previous treks yet.' : 'You have no upcoming treks.'}</p>
          <Link to="/treks" className="inline-block rounded bg-[#ffcc00] px-5 py-2 text-sm font-semibold text-[#111827] hover:brightness-95">Browse treks</Link>
        </div>
      ) : (
        <ul className="space-y-4">{list.map((b) => (
          <li key={b.id} className="rounded bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div><p className="font-dash text-base font-bold text-black">{b.item}</p><p className="mt-0.5 text-xs capitalize text-dashlink">{b.type}</p></div>
              <Badge tone={tone[b.status]}>{b.status}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-dashgreen" />{b.date || 'Date to be confirmed'}</span>
              <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-dashgreen" />{b.people} {b.people > 1 ? 'people' : 'person'}</span>
              <span className="font-semibold text-black"><Rupee value={b.amount} /></span>
            </div>
          </li>))}</ul>
      )}
    </>
  );
}