import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Clock3, ArrowUp } from 'lucide-react';
import { useSettings } from '../lib/store';
import { useUserAuth, DASHBOARD } from '../user/UserAuth';

const SocialIcon = ({ name }) => {
  const common = { width: 26, height: 26, viewBox: '0 0 24 24', 'aria-hidden': true };
  if (name === 'facebook') return (
    <svg {...common}>
      <circle cx="12" cy="12" r="11" fill="#1877f2" />
      <path fill="#fff" d="M13.4 21v-7h2.3l.4-2.8h-2.7V9.4c0-.8.3-1.3 1.4-1.3h1.4V5.6c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.1H8.3V14h2.3v7z" />
    </svg>
  );
  if (name === 'instagram') return (
    <svg {...common}>
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0" stopColor="#fdf497" />
          <stop offset=".05" stopColor="#fdf497" />
          <stop offset=".45" stopColor="#fd5949" />
          <stop offset=".6" stopColor="#d6249f" />
          <stop offset=".9" stopColor="#285aeb" />
        </radialGradient>
      </defs>
      <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="url(#ig-grad)" />
      <rect x="5.5" y="5.5" width="13" height="13" rx="4" fill="none" stroke="#fff" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="#fff" strokeWidth="1.7" />
      <circle cx="16.2" cy="7.8" r="1" fill="#fff" />
    </svg>
  );
  if (name === 'youtube') return (
    <svg {...common}>
      <rect x="1" y="4.5" width="22" height="15" rx="4.5" fill="#ff0000" />
      <path fill="#fff" d="M10 8.9v6.2l5.3-3.1z" />
    </svg>
  );
  return (
    <svg {...common}>
      <rect x="1.5" y="1.5" width="21" height="21" rx="3" fill="#0a66c2" />
      <path fill="#fff" d="M6.2 9.6h2.4V18H6.2zM7.4 5.8a1.4 1.4 0 110 2.8 1.4 1.4 0 010-2.8zM10.3 9.6h2.3v1.1c.4-.7 1.3-1.3 2.6-1.3 2.5 0 3 1.6 3 3.8V18h-2.4v-4.3c0-1 0-2.2-1.4-2.2s-1.6 1.1-1.6 2.1V18h-2.4z" />
    </svg>
  );
};

const SOCIAL = [['facebook', 'Facebook'], ['instagram', 'Instagram'], ['youtube', 'YouTube'], ['linkedin', 'LinkedIn']];

export default function Footer() {
  const s = useSettings();
  const { user } = useUserAuth();
  const [top, setTop] = useState(false);
  useEffect(() => {
    const on = () => setTop(window.scrollY > 500);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const hours = String(s.hours || '').split(';').map((x) => x.trim()).filter(Boolean);
  const head = 'mb-2 font-serif text-[20px] font-bold leading-tight text-black';
  const link = 'block font-serif text-[14.5px] leading-[1.35] text-black hover:underline';

  return (
    <footer className="bg-white pb-12 pt-10 text-black">
      <div className="container grid gap-10 md:grid-cols-3">
        <div>
          <h4 className={head}>Quick Links</h4>
          <Link to="/treks" className={link}>Browse all Uttarakhand treks</Link>
          <Link to="/upcoming" className={link}>See upcoming trek dates</Link>
          <Link to="/weather" className={link}>Latest weather updates</Link>
          <Link to={user ? DASHBOARD : '/login'} className={link}>{user ? 'Go to my Trekker Dashboard' : 'Login or register as a trekker'}</Link>
          <Link to="/contact" className={link}>Talk to a trek advisor</Link>
          <Link to="/policies/cancellation" className={link}>Read our Cancellation Policy</Link>
        </div>
        <div>
          <h4 className={head}>Follow Us On</h4>
          <div className="mb-8 mt-3 flex items-center gap-4">
            {SOCIAL.map(([key, label]) => (
              <a key={key} href={s.social?.[key] || '#'} target="_blank" rel="noopener noreferrer" aria-label={label} className="transition hover:scale-110">
                <SocialIcon name={key} />
              </a>
            ))}
          </div>
          <Link to="/policies/privacy" className={link}>Privacy Policy</Link>
          <Link to="/policies/terms" className={link}>Terms &amp; Conditions</Link>
        </div>
        <div>
          <h4 className={head}>Contact Us</h4>
          <p className="flex items-center gap-2 font-serif text-[14.5px]"><Phone className="h-3.5 w-3.5" />{s.phone}</p>
          {hours.map((h) => <p key={h} className="flex items-center gap-2 font-serif text-[14.5px]"><Clock3 className="h-3.5 w-3.5 shrink-0" />{h}</p>)}
          <h5 className="mb-1 mt-6 font-serif text-[18px] font-bold">Our Office</h5>
          <p className="max-w-[260px] font-serif text-[14px] leading-snug">{s.address}</p>
          <p className="mt-2 font-serif text-[14px]">{s.email}</p>
        </div>
      </div>
      <div className="container mt-14 font-serif text-[14px] leading-snug">
        <p>© {new Date().getFullYear()} {s.siteName}</p>
        <p>All images are copyrighted by their respective authors.</p>
      </div>
      {top && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" className="fixed bottom-16 right-4 z-30 grid h-10 w-10 place-items-center rounded-md bg-white shadow-[0_2px_10px_rgba(0,0,0,0.25)] hover:bg-ihfaq"><ArrowUp className="h-5 w-5" /></button>
      )}
    </footer>
  );
}