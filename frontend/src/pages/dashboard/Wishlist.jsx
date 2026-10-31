import { Link } from 'react-router-dom';
import { useUserAuth } from '../../user/UserAuth';
import TrekCard from '../../components/TrekCard';
import { DashHeading, SectionTitle } from './DashboardLayout';

export default function Wishlist() {
  const { wish } = useUserAuth();
  return (
    <>
      <DashHeading sub="Treks you have saved for later. Tap the heart on a trek to remove it." />
      <SectionTitle>My wishlist</SectionTitle>
      {!wish.length ? (
        <div className="rounded bg-white p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
          <p className="mb-4 text-sm">Your wishlist is empty. Tap the heart on any trek to save it here.</p>
          <Link to="/treks" className="inline-block rounded bg-[#ffcc00] px-5 py-2 text-sm font-semibold text-[#111827] hover:brightness-95">Browse treks</Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-2">{wish.map((t) => <TrekCard key={t.id} trek={t} />)}</div>
      )}
    </>
  );
}