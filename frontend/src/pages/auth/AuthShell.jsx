import { useState } from 'react';
import { Eye, EyeOff, Info } from 'lucide-react';
import { Logo } from '../../components/Header';
import { useSettings } from '../../lib/store';

// Page frame used by Login, Register, Forgot and Reset password.
export default function AuthShell({ title, children }) {
  const s = useSettings();
  return (
    <div className="min-h-screen bg-white font-auth text-black">
      <div className="flex items-center justify-center gap-2 bg-authbanner px-4 py-2.5 text-center text-[13px] text-white sm:text-sm">
        <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>Welcome to {s.siteName}. If you face any issues, write to {s.email}</span>
      </div>
      <div className="flex justify-center px-4 pb-4 pt-6"><Logo /></div>
      <main className="px-4 pb-16">
        <div className="mx-auto w-full max-w-[544px] bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.13)] sm:p-12">
          <h1 className="mb-6 font-auth text-[24px] font-bold leading-tight text-black sm:text-[26px] lg:text-[26px]">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
}

export function Field({ label, required, error, children }) {
  return (
    <div className="mb-4">
      <label className="auth-label">{label}{required && <span className="ml-1 text-red-600">*</span>}</label>
      {children}
      {error && <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function PasswordInput({ value, onChange, autoComplete = 'current-password', id }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex">
      <input id={id} type={show ? 'text' : 'password'} value={value} onChange={onChange} autoComplete={autoComplete} className="auth-input rounded-r-none" />
      <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} className="grid h-10 w-12 shrink-0 place-items-center rounded-r-[10px] border border-l-0 border-authborder bg-white">
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}

export const OrDivider = () => (
  <div className="my-6 flex items-center gap-4 text-sm text-[#666]"><span className="h-px flex-1 bg-[#bbb]" />OR<span className="h-px flex-1 bg-[#bbb]" /></div>
);

export const FormError = ({ children }) => children ? <p role="alert" className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{children}</p> : null;