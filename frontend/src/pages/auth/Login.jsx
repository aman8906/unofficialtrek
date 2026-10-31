import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthShell, { Field, PasswordInput, OrDivider, FormError } from './AuthShell';
import GoogleButton from './GoogleButton';
import { useUserAuth, afterLogin } from '../../user/UserAuth';

export default function Login() {
  const { user, login, google } = useUserAuth();
  const nav = useNavigate();
  const from = afterLogin(useLocation().state?.from);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to={from} replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !pw) return setErr('Enter your email and password.');
    setBusy(true); setErr('');
    try { await login(email.trim(), pw); nav(from, { replace: true }); } catch (er) { setErr(er.message); }
    setBusy(false);
  };
  const onGoogle = async (credential) => {
    setErr('');
    try { await google(credential); nav(from, { replace: true }); } catch (er) { setErr(er.message); }
  };

  return (
    <AuthShell title="Already a member? Sign In">
      <form onSubmit={submit} noValidate>
        <FormError>{err}</FormError>
        <Field label="Email"><input autoFocus type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="auth-input" /></Field>
        <div className="mb-1"><Field label="Password"><PasswordInput value={pw} onChange={(e) => setPw(e.target.value)} /></Field></div>
        <Link to="/forgot-password" className="auth-link -mt-3 mb-5 inline-block text-[13px]">Forgot Password?</Link>
        <button className="auth-btn" disabled={busy}>{busy ? 'Signing in...' : 'Sign In'}</button>
      </form>
      <p className="mt-7 text-center text-[15px] font-medium">New to Unofficial Trek? <Link to="/register" state={{ from }} className="auth-link font-semibold">Register Here</Link></p>
      <OrDivider />
      <GoogleButton onCredential={onGoogle} />
    </AuthShell>
  );
}