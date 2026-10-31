import { Navigate, useParams } from 'react-router-dom';
import { useSettings } from '../lib/store';
import PageHero from './PageHero';

// STARTER TEXT ONLY. Replace with your final policies (have them checked by a lawyer).
const POLICIES = {
  privacy: { title: 'Privacy Policy', body: [
    'We collect the details you give us when you register, book or send an enquiry, such as your name, phone number, email, date of birth and emergency contact.',
    'We use these details only to run your booking, keep you safe on the trek and contact you about it. We do not sell your personal data.',
    'You can ask us to correct or delete your details at any time by writing to us.',
  ] },
  terms: { title: 'Terms and Conditions', body: [
    'Trekking in the mountains carries natural risks. By booking you confirm that you have shared your health details honestly and that you will follow the instructions of the trek leader.',
    'Itineraries can change because of weather or safety. Your trek leader has the final say on any change or turn-back.',
    'Prices, inclusions and exclusions are shown on each trek page before you pay.',
  ] },
  cancellation: { title: 'Cancellation Policy', body: [
    'The cancellation and refund terms that apply to your trek are shown on the trek page before you pay.',
    'If we have to cancel a batch because of weather or safety, we will offer you a safe alternative date or a voucher.',
    'To cancel or change your booking, contact us with your booking details as early as you can.',
  ] },
};

export default function Policy() {
  const { type } = useParams();
  const s = useSettings();
  const p = POLICIES[type];
  if (!p) return <Navigate to="/" replace />;
  return (
    <>
      <PageHero title={p.title} crumbs={[[p.title]]} />
      <section className="section"><div className="container max-w-3xl space-y-4 font-serif text-[16px] leading-relaxed text-black">
        {p.body.map((t, i) => <p key={i}>{t}</p>)}
        <p className="text-sm">Questions? Write to {s.email}.</p>
      </div></section>
    </>
  );
}