import { useState } from 'react';
import { Link as LinkIcon, PhoneCall, AtSign, X, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../lib/store';
import { postEnquiry } from '../services/api';
import { HomeHeading } from '../components/home/primitives';

const ICON = 'h-12 w-12 text-[#2b3a49]';

function SirenIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden="true">
      <g stroke="#f5c518" strokeWidth="3" strokeLinecap="round"><path d="M32 4v7" /><path d="M12 12l5 5" /><path d="M52 12l-5 5" /><path d="M4 30h7" /><path d="M60 30h-7" /></g>
      <path d="M16 46V34a16 16 0 0 1 32 0v12z" fill="#ef4136" />
      <path d="M24 36a8 8 0 0 1 6-7" stroke="#fff" strokeOpacity=".7" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="10" y="46" width="44" height="7" rx="1" fill="#2b3a49" />
    </svg>
  );
}

function Block({ icon, title, children }) {
  return (
    <div className="flex gap-5">
      <div className="w-[62px] shrink-0 pt-1">{icon}</div>
      <div>
        <h2 className="mb-3 font-serif text-[22px] font-medium leading-tight text-black sm:text-[22px] lg:text-[22px]">{title}</h2>
        <div className="space-y-4 font-serif text-[14px] leading-[1.5] text-black">{children}</div>
      </div>
    </div>
  );
}

function CallbackModal({ onClose }) {
  const [f, setF] = useState({ name: '', phone: '', slot: 'Morning (9:30 am to 12:30 pm)' });
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (f.name.trim().length < 2) return setErr('Enter your name.');
    if (!/^[0-9+\s-]{10,15}$/.test(f.phone.trim())) return setErr('Enter a valid phone number.');
    setBusy(true); setErr('');
    try { await postEnquiry({ name: f.name.trim(), phone: f.phone.trim(), email: '', message: `[Callback request] Best time: ${f.slot}` }); setDone(true); } catch { setErr('Could not send. Please try again.'); }
    setBusy(false);
  };
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/55 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label="Request a callback">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100"><X className="h-5 w-5" /></button>
        {done ? (
          <div className="py-4 text-center"><CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-ihgreen" /><h3 className="font-serif text-xl font-bold">Callback requested</h3><p className="mt-2 text-sm">Our trek advisor will call you at your chosen time.</p><button onClick={onClose} className="mt-5 rounded-sm bg-ihyellow px-6 py-2 font-head text-sm font-bold">Close</button></div>
        ) : (
          <form onSubmit={submit} noValidate>
            <h3 className="mb-1 font-serif text-xl font-bold text-black">Request a callback</h3>
            <p className="mb-4 text-sm">Tell us when to call you and a trek advisor will ring you.</p>
            <label className="label" htmlFor="cb-n">Your name</label><input id="cb-n" className="input mb-3" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" />
            <label className="label" htmlFor="cb-p">Phone number</label><input id="cb-p" className="input mb-3" inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} autoComplete="tel" />
            <label className="label" htmlFor="cb-s">Best time to call</label>
            <select id="cb-s" className="input" value={f.slot} onChange={(e) => setF({ ...f, slot: e.target.value })}><option>Morning (9:30 am to 12:30 pm)</option><option>Afternoon (12:30 pm to 4:30 pm)</option><option>Evening (4:30 pm to 7:00 pm)</option></select>
            {err && <p role="alert" className="mt-3 text-sm text-red-600">{err}</p>}
            <button className="mt-5 w-full rounded-sm bg-ihgreen py-2.5 font-head text-sm font-bold text-white hover:brightness-110 disabled:opacity-60" disabled={busy}>{busy ? 'Sending...' : 'Request callback'}</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ContactPage() {
  const s = useSettings();
  const [cb, setCb] = useState(false);
  const hours = String(s.hours || '').split(';').map((x) => x.trim()).filter(Boolean);
  return (
    <section className="py-12">
      <div className="mx-auto w-full max-w-[1040px] px-4 sm:px-6">
        <HomeHeading title="Get In Touch With Us" />
        <div className="mt-12 grid gap-x-16 gap-y-14 md:grid-cols-2">
          <Block icon={<LinkIcon className={ICON} strokeWidth={2.6} />} title="Request a Callback from our Trek Advisors">
            <p>Have questions? Talk to our trek advisors. They are experienced trekkers who will give you honest advice. The best way to reach them is to ask for a callback at a time that suits you.</p>
            <p><button onClick={() => setCb(true)} className="text-left text-ihlink hover:underline">Click here to request a Callback.</button></p>
          </Block>
          <Block icon={<PhoneCall className={ICON} strokeWidth={2.4} />} title="Call Us">
            <p>To speak to us directly, call us on <strong>{s.phone}</strong>. {hours.length ? <>We are available <strong className="font-normal">{hours.join('. ')}.</strong></> : null} <strong>Please call us only during working hours, as our team will not be available any other time.</strong></p>
          </Block>
          <Block icon={<AtSign className={ICON} strokeWidth={2.6} />} title="Write To Us">
            <p>To get in touch via email, write to us at <strong>{s.email}</strong>. We will write back to you within 24 hours.</p>
          </Block>
          <Block icon={<SirenIcon />} title="Emergency Contact">
            <p>If your family member is unreachable on a trek and you have an emergency back home, call <strong>{s.emergencyPhone}</strong>. We will do our best to pass your message to them quickly through our team on the trail. Please respect the urgency of this line and use it only for emergencies.</p>
          </Block>
        </div>
        <p className="mt-14 font-serif text-[14px] text-black"><strong>Our office:</strong> {s.address}</p>
      </div>
      {cb && <CallbackModal onClose={() => setCb(false)} />}
    </section>
  );
}