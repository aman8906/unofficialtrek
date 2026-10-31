import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Clock3, Facebook, Instagram, Youtube, Linkedin, ArrowUp } from 'lucide-react';
import { useSettings } from '../lib/store';
import { useUserAuth, DASHBOARD } from '../user/UserAuth';

const social = [[Facebook, 'facebook', 'bg-[#1877f2]', 'Facebook'], [Instagram, 'instagram', 'bg-gradient-to-tr from-[#f9a825] via-[#e1306c] to-[#833ab4]', 'Instagram'], [Youtube, 'youtube', 'bg-[#ff0000]', 'YouTube']];

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
          <div className="mb-8 mt-3 flex gap-4">
            {social.map(([Icon, key, bg, label]) => (
              <a key={key} href={s.social?.[key] || '#'} target="_blank" rel="noopener noreferrer" aria-label={label} className={`grid h-6 w-6 place-items-center rounded-md text-white transition hover:scale-110 ${bg}`}><Icon className="h-4 w-4" /></a>
            ))}
            <span className="grid h-6 w-6 place-items-center rounded-md bg-[#0a66c2] text-white" aria-hidden="true"><Linkedin className="h-4 w-4" /></span>
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