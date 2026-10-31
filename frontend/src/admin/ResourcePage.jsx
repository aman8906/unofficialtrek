import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2, Download, X, Check } from 'lucide-react';
import { useLocalStore } from '../lib/store';
import { Badge, Rupee } from '../components/ui';
import { USE_MOCK } from '../services/api';
import { adminApi, errMsg } from '../services/adminApi';

const PER = 8;
const tone = { confirmed: 'green', open: 'green', pending: 'amber', cancelled: 'red', closed: 'grey', rafting: 'brand', bungee: 'accent', super_admin: 'accent', content_manager: 'brand', booking_manager: 'brand', viewer: 'grey', customer: 'grey' };

const toForm = (fields, row) => Object.fromEntries(fields.map((f) => [f.key, f.type === 'tags' ? (row?.[f.key] || []).join(', ') : row?.[f.key] ?? (f.type === 'checkbox' ? false : '')]));
const fromForm = (fields, form) => Object.fromEntries(fields.map((f) => [f.key, f.type === 'tags' ? form[f.key].split(',').map((s) => s.trim()).filter(Boolean) : f.type === 'number' ? Number(form[f.key] || 0) : form[f.key]]));

// Same interface for both modes: demo data in localStorage, or the real API.
function useMockRows(res) {
  const [rows, setRows] = useLocalStore(`admin:${res.key}`, res.seed);
  return {
    rows, loading: false, error: '',
    create: async (data) => setRows([{ id: Date.now().toString(36), ...(res.defaults || {}), ...data }, ...rows]),
    update: async (row, data) => setRows(rows.map((r) => (r.id === row.id ? { ...r, ...data } : r))),
    remove: async (row) => setRows(rows.filter((r) => r.id !== row.id)),
  };
}
function useApiRows(res) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true);
    try { setRows(await adminApi.list(res.key)); setError(''); } catch (e) { setError(errMsg(e)); }
    setLoading(false);
  }, [res.key]);
  useEffect(() => { load(); }, [load]);
  return {
    rows, loading, error,
    create: async (data) => { const r = await adminApi.create(res.key, { ...(res.defaults || {}), ...data }); await load(); return r; },
    update: async (row, data) => { await adminApi.update(res.key, row.id, data); await load(); },
    remove: async (row) => { await adminApi.remove(res.key, row.id); await load(); },
  };
}
const useRows = USE_MOCK ? useMockRows : useApiRows;

function Cell({ col, row }) {
  const v = row[col.key];
  if (col.bool) return v ? <Check className="h-4 w-4 text-emerald-600" /> : <span className="text-slate-300">-</span>;
  if (col.money) return <Rupee value={v} />;
  if (col.badge) return <Badge tone={tone[v] || 'grey'}>{v}</Badge>;
  return <span className="line-clamp-1 max-w-[260px]">{String(v ?? '')}</span>;
}

export default function ResourcePage({ res }) {
  const { rows, loading, error, create, update, remove } = useRows(res);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [edit, setEdit] = useState(null); // null | 'new' | row
  const [form, setForm] = useState({});
  const [formErr, setFormErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const filtered = useMemo(() => rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q.toLowerCase())), [rows, q]);
  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const view = filtered.slice((page - 1) * PER, page * PER);

  const open = (row) => { setEdit(row); setFormErr(''); setForm(toForm(res.fields, row === 'new' ? null : row)); };
  const save = async (e) => {
    e.preventDefault();
    setBusy(true); setFormErr('');
    try {
      const data = fromForm(res.fields, form);
      if (edit === 'new') { const r = await create(data); if (r?.tempPassword) setNotice(`User created. Temporary password (shown once): ${r.tempPassword}`); }
      else await update(edit, data);
      setEdit(null);
    } catch (er) { setFormErr(errMsg(er)); }
    setBusy(false);
  };
  const del = async (row) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    try { await remove(row); } catch (er) { setNotice(errMsg(er)); }
  };
  const exportCsv = () => {
    const keys = res.columns.map((c) => c.key);
    const csv = [keys.join(','), ...filtered.map((r) => keys.map((k) => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = `${res.key}.csv`; a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl sm:text-3xl lg:text-3xl">{res.title}</h1><p className="mt-1 text-sm">{rows.length} total</p></div>
        <div className="flex flex-wrap gap-2"><button onClick={exportCsv} className="btn-outline"><Download className="h-4 w-4" />Export CSV</button><button onClick={() => open('new')} className="btn-primary"><Plus className="h-4 w-4" />Add new</button></div>
      </div>
      {notice && <p role="status" className="flex items-start justify-between gap-3 rounded-card bg-amber-50 p-4 text-sm text-amber-900">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss"><X className="h-4 w-4" /></button></p>}
      {error && <p role="alert" className="rounded-card bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      <div className="rounded-card bg-white shadow-card">
        <div className="border-b border-line p-4"><div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" /><input className="input pl-9" placeholder={`Search ${res.title.toLowerCase()}`} value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} /></div></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-section-alt text-xs text-ink"><tr>{res.columns.map((c) => <th key={c.key} className="px-4 py-3 font-semibold">{c.label}</th>)}<th className="px-4 py-3 text-right font-semibold">Actions</th></tr></thead>
            <tbody>
              {view.map((r) => (
                <tr key={r.id} className="border-t border-line hover:bg-section-alt/60">
                  {res.columns.map((c) => <td key={c.key} className="px-4 py-3"><Cell col={c} row={r} /></td>)}
                  <td className="px-4 py-3"><div className="flex justify-end gap-1">
                    <button onClick={() => open(r)} aria-label="Edit" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-brand-light hover:text-brand"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => del(r)} aria-label="Delete" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div></td>
                </tr>))}
              {loading && <tr><td colSpan={res.columns.length + 1} className="px-4 py-12 text-center">Loading...</td></tr>}
              {!loading && !view.length && <tr><td colSpan={res.columns.length + 1} className="px-4 py-12 text-center">Nothing here yet. Use “Add new” to create the first item.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-line p-4 text-sm">
          <span>Page {page} of {pages}</span>
          <div className="flex gap-2"><button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn-outline px-4 py-2 disabled:opacity-40">Previous</button><button disabled={page >= pages} onClick={() => setPage(page + 1)} className="btn-outline px-4 py-2 disabled:opacity-40">Next</button></div>
        </div>
      </div>

      {edit && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/50 sm:place-items-center sm:p-4" onClick={() => setEdit(null)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-card-hover sm:rounded-card sm:p-6">
            <div className="mb-5 flex items-center justify-between"><h3>{edit === 'new' ? `Add to ${res.title}` : `Edit ${res.title}`}</h3><button type="button" onClick={() => setEdit(null)} aria-label="Close"><X className="h-5 w-5" /></button></div>
            <div className="grid gap-4 sm:grid-cols-2">
              {res.fields.map((f) => {
                const id = `f-${f.key}`;
                const wide = f.type === 'textarea' || f.type === 'tags';
                return (
                  <div key={f.key} className={wide ? 'sm:col-span-2' : ''}>
                    {f.type === 'checkbox' ? (
                      <label className="flex cursor-pointer items-center gap-2 pt-6 text-sm font-medium text-ink"><input type="checkbox" checked={!!form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })} className="h-4 w-4 accent-[#1f4d3a]" />{f.label}</label>
                    ) : (<>
                      <label className="label" htmlFor={id}>{f.label}</label>
                      {f.type === 'textarea' ? <textarea id={id} rows="3" className="input" value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                        : f.type === 'select' ? <select id={id} className="input" value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}><option value="">Select</option>{f.options.map((o) => <option key={o}>{o}</option>)}</select>
                        : <input id={id} required={f.required} type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'} className="input" value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />}
                    </>)}
                  </div>);
              })}
            </div>
            {formErr && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{formErr}</p>}
            <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setEdit(null)} className="btn-outline">Cancel</button><button className="btn-primary" disabled={busy}>{busy ? 'Saving...' : 'Save changes'}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
