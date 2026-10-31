import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AuthShell, { Field, PasswordInput, FormError } from './AuthShell';
import { useUserAuth } from '../../user/UserAuth';

export default function ResetPassword() {
  const { token } = useParams();
  const { reset } = useUserAuth();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (pw.length < 8) return setErr('Use at least 8 characters.');
    if (pw !== pw2) return setErr('The two passwords do not match.');
    setBusy(true); setErr('');
    try { setDone(await reset(token, pw)); } catch (er) { setErr(er.message); }
    setBusy(false);
  };

  return (
    <AuthShell title="Set a new password">
      {done ? (
        <>
          <p role="status" className="mb-5 rounded bg-green-50 px-3 py-3 text-sm text-green-800">{done}</p>
          <Link to="/login" className="auth-btn">Sign In</Link>
        </>
      ) : (
        <form onSubmit={submit} noValidate>
          <FormError>{err}</FormError>
          <Field label="New password" required><PasswordInput value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" /></Field>
          <Field label="Confirm new password" required><PasswordInput value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" /></Field>
          <button className="auth-btn" disabled={busy}>{busy ? 'Saving...' : 'Save password'}</button>
          <Link to="/forgot-password" className="auth-btn-outline mt-3">Request a new link</Link>
        </form>
      )}
    </AuthShell>
  );
}