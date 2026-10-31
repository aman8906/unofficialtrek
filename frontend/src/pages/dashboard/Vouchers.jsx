import { useEffect, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useUserAuth } from '../../user/UserAuth';
import { DashHeading, SectionTitle } from './DashboardLayout';

export default function Vouchers() {
  const { vouchers } = useUserAuth();
  const [rows, setRows] = useState(null);
  const [copied, setCopied] = useState('');
  const [err, setErr] = useState('');
  useEffect(() => { vouchers().then(setRows).catch((e) => { setErr(e.message); setRows([]); }); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const copy = (code) => { navigator.clipboard?.writeText(code); setCopied(code); setTimeout(() => setCopied(''), 1800); };

  return (
    <>
      <DashHeading sub="Vouchers you can use on your next booking." />
      <SectionTitle>Trek vouchers</SectionTitle>
      {err && <p role="alert" className="mb-4 text-sm text-red-600">{err}</p>}
      {!rows ? <p className="text-sm">Loading...</p> : !rows.length ? (
        <div className="rounded bg-white p-8 text-center text-sm shadow-[0_2px_8px_rgba(0,0,0,0.18)]">No vouchers available right now.</div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">{rows.map((v) => (
          <li key={v.id} className="rounded bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
            <p className="font-dash text-2xl font-bold text-dashgreen">{v.type === 'percent' ? `${v.value}% off` : `₹${Number(v.value).toLocaleString('en-IN')} off`}</p>
            <p className="mt-1 text-sm text-black">{v.title || 'Trek voucher'}</p>
            <div className="mt-4 flex items-center justify-between rounded border border-dashed border-dashgreen bg-dashfield px-3 py-2">
              <code className="text-sm font-bold tracking-wider text-black">{v.code}</code>
              <button onClick={() => copy(v.code)} aria-label="Copy code" className="text-dashgreen">{copied === v.code ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</button>
            </div>
            <p className="mt-3 text-xs text-dashlink">{v.expiresAt ? `Valid till ${v.expiresAt}` : 'No expiry date'}. Tell our team this code when you book.</p>
          </li>))}</ul>
      )}
    </>
  );
}