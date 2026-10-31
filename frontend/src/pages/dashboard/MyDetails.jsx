import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { useUserAuth } from '../../user/UserAuth';
import { PHONE_CODES, NATIONALITIES, GENDERS, splitPhone } from '../../lib/countries';
import { DashHeading, SectionTitle } from './DashboardLayout';

const base = 'h-9 w-full rounded-lg bg-dashfield px-4 text-xs text-black outline-none focus:ring-1 focus:ring-dashgreen';
const today = new Date().toISOString().slice(0, 10);

function Row({ label, required = true, children, error }) {
  return (
    <div className="mb-3 grid items-center gap-x-3 gap-y-1 sm:grid-cols-[130px_1fr]">
      <label className="text-[13px] font-semibold leading-tight text-black">{label}{required && ' *'}</label>
      <div>{children}{error && <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}</div>
    </div>
  );
}
const GreenBox = ({ children }) => <span className="pointer-events-none absolute right-0 top-0 grid h-9 w-9 place-items-center rounded-r-lg bg-dashgreen text-white">{children}</span>;

export default function MyDetails() {
  const { user, updateProfile } = useUserAuth();
  const ph = splitPhone(user.phone);
  const [f, setF] = useState({
    firstName: user.firstName || '', lastName: user.lastName || '', gender: user.gender || '', dob: user.dob || '', nationality: user.nationality || '',
    dial: ph.dial, phone: ph.number, company: user.company || '', designation: user.designation || '',
  });
  const [errs, setErrs] = useState({});
  const [msg, setMsg] = useState({ ok: '', err: '' });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    const er = {};
    if (!f.firstName.trim()) er.firstName = 'Required';
    if (!f.lastName.trim()) er.lastName = 'Required';
    if (!f.gender) er.gender = 'Select your gender';
    if (!f.dob) er.dob = 'Enter your date of birth'; else if (f.dob >= today) er.dob = 'Must be in the past';
    if (!f.nationality) er.nationality = 'Select your nationality';
    const digits = f.phone.replace(/\D/g, '').replace(/^0+/, '');
    if ((f.dial + digits).replace(/\D/g, '').length < 8) er.phone = 'Enter a valid phone number';
    if (!f.company.trim()) er.company = 'Required';
    if (!f.designation.trim()) er.designation = 'Required';
    setErrs(er);
    if (Object.keys(er).length) return;
    setBusy(true); setMsg({ ok: '', err: '' });
    try {
      await updateProfile({ firstName: f.firstName.trim(), lastName: f.lastName.trim(), gender: f.gender, dob: f.dob, nationality: f.nationality, phone: f.dial + digits, company: f.company.trim(), designation: f.designation.trim() });
      setMsg({ ok: 'Your details are saved.', err: '' });
    } catch (x) { setMsg({ ok: '', err: x.message }); }
    setBusy(false);
  };

  return (
    <>
      <DashHeading sub="Update your personal information here." />
      <SectionTitle>Essential Information</SectionTitle>
      <form onSubmit={save} noValidate className="rounded bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.18)] sm:p-9">
        <Row label="First Name" error={errs.firstName}><input value={f.firstName} onChange={set('firstName')} className={base} /></Row>
        <Row label="Last Name" error={errs.lastName}><input value={f.lastName} onChange={set('lastName')} className={base} /></Row>
        <Row label="Email Id"><input value={user.email} readOnly disabled className={`${base} cursor-not-allowed opacity-70`} /></Row>
        <Row label="Gender" error={errs.gender}>
          <div className="relative"><select value={f.gender} onChange={set('gender')} className={`${base} appearance-none pr-12`}><option value="" />{GENDERS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select><GreenBox><ChevronDown className="h-4 w-4" /></GreenBox></div>
        </Row>
        <Row label="Date Of Birth" error={errs.dob}>
          <div className="relative"><input type="date" max={today} value={f.dob} onChange={set('dob')} className={`${base} pr-12 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:h-9 [&::-webkit-calendar-picker-indicator]:w-9 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`} /><GreenBox><Calendar className="h-4 w-4" /></GreenBox></div>
        </Row>
        <Row label="Nationality" error={errs.nationality}>
          <div className="relative"><select value={f.nationality} onChange={set('nationality')} className={`${base} appearance-none pr-12`}><option value="" />{NATIONALITIES.map((n) => <option key={n}>{n}</option>)}</select><GreenBox><ChevronDown className="h-4 w-4" /></GreenBox></div>
        </Row>
        <Row label="Phone" error={errs.phone}>
  <div className="flex gap-2">
    <select value={f.dial} onChange={set('dial')} aria-label="Country code" className={`${base} w-[128px] shrink-0 px-2`}>
      {PHONE_CODES.map((c) => <option key={c.cc} value={c.dial}>{c.label}</option>)}
    </select>
    <input
      type="tel"
      inputMode="numeric"
      autoComplete="tel-national"
      maxLength={15}
      placeholder="Mobile number"
      value={f.phone}
      onChange={(e) => setF({ ...f, phone: e.target.value.replace(/\D/g, '') })}
      className={`${base} min-w-0`}
    />
  </div>
</Row>
        <Row label="Company / College / School" error={errs.company}><input value={f.company} onChange={set('company')} placeholder="Company / College / School" className={`${base} placeholder:text-dashlink/70`} /></Row>
        <Row label="Designation / Course / Grade" error={errs.designation}><input value={f.designation} onChange={set('designation')} placeholder="Designation / Course / Grade" className={`${base} placeholder:text-dashlink/70`} /></Row>

        {msg.err && <p role="alert" className="mb-3 text-sm text-red-600">{msg.err}</p>}
        {msg.ok && <p role="status" className="mb-3 text-sm font-medium text-green-700">{msg.ok}</p>}
        <div className="sm:pl-[142px]"><button className="h-9 rounded bg-dashgreen px-8 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60" disabled={busy}>{busy ? 'Saving...' : 'Save details'}</button></div>
      </form>
    </>
  );
}