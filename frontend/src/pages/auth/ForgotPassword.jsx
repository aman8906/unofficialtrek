import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthShell, { Field, FormError } from './AuthShell';
import { useUserAuth } from '../../user/UserAuth';

export default function ForgotPassword() {
  const { forgot } = useUserAuth();
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setErr('Enter a valid email.');
    setBusy(true); setErr('');
    try { setDone(await forgot(email.trim())); } catch (er) { setErr(er.message); }
    setBusy(false);
  };

  return (
    <AuthShell title="Forgot Your Password?">
      {done ? (
        <>
          <p role="status" className="mb-5 rounded bg-green-50 px-3 py-3 text-sm text-green-800">{done}</p>
          <p className="mb-5 text-sm">The link works for 15 minutes. Check your spam folder if you do not see it.</p>
        </>
      ) : (
        <form onSubmit={submit} noValidate>
          <p className="mb-4 text-sm leading-relaxed">Enter your email address and we will send you instructions on how to create a new password.</p>
          <FormError>{err}</FormError>
          <Field label="Email"><input autoFocus type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="auth-input" /></Field>
          <button className="auth-btn" disabled={busy}>{busy ? 'Sending...' : 'Submit'}</button>
        </form>
      )}
      <Link to="/login" className="auth-btn-outline mt-3">« Back to Login</Link>
    </AuthShell>
  );
}