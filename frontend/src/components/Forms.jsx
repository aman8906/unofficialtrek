import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { postBooking, postEnquiry } from '../services/api';

const empty = { name: '', phone: '', email: '', date: '', people: 1, message: '' };

export function EnquiryForm({ title = 'Send an enquiry', subject = '', kind = 'enquiry', extra = {}, cta = 'Send enquiry' }) {
  const [f, setF] = useState(empty);
  const [state, setState] = useState('idle');
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name.trim()) return setErr('Enter your name.');
    if (!/^[0-9+\s-]{10,15}$/.test(f.phone.trim())) return setErr('Enter a valid phone number.');
    setErr(''); setState('sending');
    try {
      if (kind === 'booking') await postBooking({ name: f.name, phone: f.phone, date: f.date, people: Number(f.people), item: subject, type: extra.type || 'trek', amount: (extra.price || 0) * Number(f.people) });
      else await postEnquiry({ name: f.name, phone: f.phone, email: f.email, message: `${subject ? `[${subject}] ` : ''}${f.message}` });
      setState('done'); setF(empty);
    } catch { setState('idle'); setErr('Could not send. Please try again.'); }
  };

  if (state === 'done') return (
    <div className="rounded-card border border-line bg-white p-6 text-center">
      <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-brand" />
      <h3>Request received</h3><p className="mt-2 text-sm">Our team will call you within one working day.</p>
      <button className="btn-outline mt-5" onClick={() => setState('idle')}>Send another</button>
    </div>
  );

  return (
    <form onSubmit={submit} className="rounded-card border border-line bg-white p-5 sm:p-6" noValidate>
      <h3 className="mb-4">{title}</h3>
      <div className="space-y-4">
        <div><label className="label" htmlFor="n">Full name</label><input id="n" className="input" value={f.name} onChange={set('name')} autoComplete="name" /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="p">Phone</label><input id="p" className="input" value={f.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" /></div>
          {kind === 'booking'
            ? <div><label className="label" htmlFor="pp">People</label><input id="pp" type="number" min="1" max="20" className="input" value={f.people} onChange={set('people')} /></div>
            : <div><label className="label" htmlFor="em">Email</label><input id="em" type="email" className="input" value={f.email} onChange={set('email')} autoComplete="email" /></div>}
        </div>
        {kind === 'booking'
          ? <div><label className="label" htmlFor="d">Preferred date</label><input id="d" type="date" className="input" value={f.date} onChange={set('date')} /></div>
          : <div><label className="label" htmlFor="m">Message</label><textarea id="m" rows="4" className="input" value={f.message} onChange={set('message')} /></div>}
      </div>
      {err && <p role="alert" className="mt-3 text-sm text-red-600">{err}</p>}
      <button className="btn-primary mt-5 w-full" disabled={state === 'sending'}>{state === 'sending' ? 'Sending...' : cta}</button>
    </form>
  );
}
