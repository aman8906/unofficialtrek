import { useEffect, useState } from 'react';
import { readStore, writeStore } from '../lib/store';
import { settings as defaults } from '../data/mock';
import { USE_MOCK } from '../services/api';
import { adminApi, errMsg } from '../services/adminApi';

const fields = [['siteName', 'Site name'], ['tagline', 'Tagline'], ['phone', 'Phone'],['emergencyPhone', 'Emergency contact number'], ['email', 'Email'], ['address', 'Address'], ['hours', 'Working hours'], ['heroTitle', 'Home hero heading'], ['heroSub', 'Home hero sub text'], ['banner', 'Announcement strip text'], ['bannerLink', 'Strip link (path)'], ['bannerLinkText', 'Strip link text']];

export default function SettingsPage() {
  const [f, setF] = useState({ ...defaults, ...readStore('admin:settings', {}) });
  const [msg, setMsg] = useState({ ok: '', err: '' });
  useEffect(() => { if (!USE_MOCK) adminApi.getSettings().then((s) => setF({ ...defaults, ...s })).catch((e) => setMsg({ ok: '', err: errMsg(e) })); }, []);
  const save = async (e) => {
    e.preventDefault();
    try {
      const saved = USE_MOCK ? f : await adminApi.saveSettings(f);
      writeStore('admin:settings', saved);
      sessionStorage.removeItem('topbar:closed');
      setMsg({ ok: 'Saved', err: '' });
    } catch (er) { setMsg({ ok: '', err: errMsg(er) }); }
    setTimeout(() => setMsg({ ok: '', err: '' }), 3000);
  };
  return (
    <form onSubmit={save} className="max-w-3xl space-y-6">
      <div><h1 className="text-2xl sm:text-3xl lg:text-3xl">Site settings</h1><p className="mt-1 text-sm">Changes show on the public website after a refresh.</p></div>
      <div className="grid gap-4 rounded-card bg-white p-5 shadow-card sm:grid-cols-2 sm:p-6">
        {fields.map(([k, label]) => {
          const wide = ['tagline', 'address', 'heroTitle', 'heroSub', 'banner'].includes(k);
          return (<div key={k} className={wide ? 'sm:col-span-2' : ''}><label className="label" htmlFor={k}>{label}</label>
            {k === 'heroSub' ? <textarea id={k} rows="3" className="input" value={f[k] || ''} onChange={(e) => setF({ ...f, [k]: e.target.value })} /> : <input id={k} className="input" value={f[k] || ''} onChange={(e) => setF({ ...f, [k]: e.target.value })} />}</div>);
        })}
      </div>
      <div className="flex items-center gap-3"><button className="btn-primary">Save settings</button>
        {msg.ok && <span role="status" className="text-sm font-medium text-emerald-700">{msg.ok}</span>}
        {msg.err && <span role="alert" className="text-sm text-red-600">{msg.err}</span>}</div>
    </form>
  );
}
