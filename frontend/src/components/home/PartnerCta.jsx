import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { partnerBanner } from '../../data/home';

export default function PartnerBanner() {
  return (
    <section className="bg-ihpartner px-4 py-8 text-center">
      <span className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full border-2 border-[#d9a400] bg-white text-[#a07900]"><Users className="h-5 w-5" /></span>
      <h2 className="font-head text-[16px] font-extrabold text-black sm:text-[17px] lg:text-[17px]">{partnerBanner.title}</h2>
      <p className="mt-2 text-[12.5px] text-black">{partnerBanner.text} <Link to={partnerBanner.link.to} className="text-ihlink underline">{partnerBanner.link.label}</Link></p>
    </section>
  );
}