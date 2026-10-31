import { useEffect, useRef, useState } from 'react';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function loadGsi() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve();
    const old = document.getElementById('gsi-script');
    if (old) { old.addEventListener('load', resolve); old.addEventListener('error', reject); return; }
    const s = document.createElement('script');
    s.id = 'gsi-script'; s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.defer = true;
    s.onload = resolve; s.onerror = () => reject(new Error('Could not load Google. Check your internet.'));
    document.head.appendChild(s);
  });
}

// Google's own "Continue with Google" button (outlined white button like the reference site).
export default function GoogleButton({ onCredential, text = 'continue_with' }) {
  const box = useRef(null);
  const cb = useRef(onCredential);
  const [err, setErr] = useState('');
  cb.current = onCredential;

  useEffect(() => {
    if (!CLIENT_ID) return undefined;
    let dead = false;
    loadGsi().then(() => {
      if (dead || !box.current) return;
      window.google.accounts.id.initialize({ client_id: CLIENT_ID, callback: (r) => cb.current(r.credential), ux_mode: 'popup' });
      const width = Math.min(400, Math.max(200, Math.floor(box.current.offsetWidth)));
      window.google.accounts.id.renderButton(box.current, { theme: 'outline', size: 'large', text, shape: 'rectangular', width, logo_alignment: 'center' });
    }).catch((e) => setErr(e.message));
    return () => { dead = true; };
  }, [text]);

  if (!CLIENT_ID) {
    return (
      <div className="rounded border border-dashed border-[#bbb] p-3 text-center text-xs text-[#666]">
        Google sign-in is not set up yet. Add <code>VITE_GOOGLE_CLIENT_ID</code> to the frontend <code>.env</code> and restart.
      </div>
    );
  }
  return (<div><div ref={box} className="flex min-h-[44px] justify-center" />{err && <p role="alert" className="mt-2 text-center text-xs text-red-600">{err}</p>}</div>);
}