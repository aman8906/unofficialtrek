import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthShell, { Field, PasswordInput, OrDivider, FormError } from './AuthShell';
import GoogleButton from './GoogleButton';
import { useUserAuth, afterLogin } from '../../user/UserAuth';
import { PHONE_CODES, NATIONALITIES, GENDERS } from '../../lib/countries';

const today = new Date().toISOString().slice(0, 10);

export default function Register() {
  const { user, register, google } = useUserAuth();
  const nav = useNavigate();
  const from = afterLogin(useLocation().state?.from);
  const [f, setF] = useState({ firstName: '', lastName: '', email: '', dial: '+91', phone: '', dob: '', gender: '', nationality: '', password: '' });
  const [errs, setErrs] = useState({});
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to={from} replace />;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const validate = () => {
    const e = {};
    if (!f.firstName.trim()) e.firstName = 'First name is required';
    if (!f.lastName.trim()) e.lastName = 'Last name is required';
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Enter a valid email';
    const digits = f.phone.replace(/\D/g, '').replace(/^0+/, '');
    const total = (f.dial + digits).replace(/\D/g, '');
    if (total.length < 8 || total.length > 15) e.phone = 'Enter a valid phone number';
    if (!f.dob) e.dob = 'Enter your date of birth';
    else if (f.dob >= today) e.dob = 'Date of birth must be in the past';
    if (!f.gender) e.gender = 'Select your gender';
    if (!f.nationality) e.nationality = 'Select your nationality';
    if (f.password.length < 8) e.password = 'Use at least 8 characters';
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true); setMsg('');
    try {
      await register({
        firstName: f.firstName.trim(), lastName: f.lastName.trim(), email: f.email.trim(), password: f.password,
        phone: f.dial + f.phone.replace(/\D/g, '').replace(/^0+/, ''), dob: f.dob, gender: f.gender, nationality: f.nationality,
      });
      nav(from, { replace: true });
    } catch (er) { setMsg(er.message); }
    setBusy(false);
  };
  const onGoogle = async (credential) => {
    setMsg('');
    try { await google(credential); nav(from, { replace: true }); } catch (er) { setMsg(er.message); }
  };

  return (
    <AuthShell title="New to Unofficial Trek? Register">
      <form onSubmit={submit} noValidate>
        <FormError>{msg}</FormError>
        <Field label="First name" required error={errs.firstName}><input value={f.firstName} onChange={set('firstName')} autoComplete="given-name" className="auth-input" /></Field>
        <Field label="Last name" required error={errs.lastName}><input value={f.lastName} onChange={set('lastName')} autoComplete="family-name" className="auth-input" /></Field>
        <Field label="Email" required error={errs.email}><input type="email" value={f.email} onChange={set('email')} autoComplete="email" className="auth-input" /></Field>
        <Field label="Phone Number" required error={errs.phone}>
          <div className="flex gap-2">
            <select value={f.dial} onChange={set('dial')} aria-label="Country code" className="auth-input w-[118px] shrink-0 px-2">{PHONE_CODES.map((c) => <option key={c.cc} value={c.dial}>{c.label}</option>)}</select>
            <input type="tel" inputMode="numeric" value={f.phone} onChange={set('phone')} autoComplete="tel-national" className="auth-input" />
          </div>
        </Field>
        <Field label="Date of birth" required error={errs.dob}><input type="date" max={today} value={f.dob} onChange={set('dob')} autoComplete="bday" className="auth-input" /></Field>
        <Field label="Gender" required error={errs.gender}>
          <select value={f.gender} onChange={set('gender')} className="auth-input"><option value="" />{GENDERS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        </Field>
        <Field label="Nationality" required error={errs.nationality}>
          <select value={f.nationality} onChange={set('nationality')} className="auth-input"><option value="" />{NATIONALITIES.map((n) => <option key={n}>{n}</option>)}</select>
        </Field>
        <Field label="Password" required error={errs.password}><PasswordInput value={f.password} onChange={set('password')} autoComplete="new-password" /></Field>
        <button className="auth-btn mt-2" disabled={busy}>{busy ? 'Creating account...' : 'Create Account'}</button>
      </form>
      <p className="mt-7 text-center text-[15px] font-medium">Already a member? <Link to="/login" state={{ from }} className="auth-link font-semibold">Sign In</Link></p>
      <OrDivider />
      <GoogleButton onCredential={onGoogle} text="signup_with" />
    </AuthShell>
  );
}