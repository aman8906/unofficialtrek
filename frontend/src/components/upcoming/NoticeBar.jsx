import { Link } from 'react-router-dom';
import { Megaphone } from 'lucide-react';

// Cream strip with yellow lines (like the reference). link = { label, to } or { label, onClick }
export default function NoticeBar({ lead, text, label, to, onClick }) {
  return (
    <div className="my-3 flex items-start gap-3 border-y border-ihyellow bg-[#fff5cc] px-3 py-2">
      <Megaphone className="mt-0.5 h-6 w-6 shrink-0 text-[#c26a12]" aria-hidden="true" />
      <p className="text-[12.5px] leading-snug text-black">
        <strong>{lead}</strong> {text}{' '}
        {to ? <Link to={to} className="text-ihlink hover:underline">{label}</Link> : <button onClick={onClick} className="text-ihlink hover:underline">{label}</button>}
      </p>
    </div>
  );
}