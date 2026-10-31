import HeroCarousel from '../components/home/HeroCarousel';
import DownloadBar from '../components/home/DownloadBar';
import SafetySection from '../components/home/SafetySection';
import TestimonialGrid from '../components/home/TestimonialGrid';
import SeasonTreks from '../components/home/SeasonTreks';
import FaqGrid from '../components/home/FaqGrid';
import ReasonsRow from '../components/home/ReasonsRow';
import AdvantageCards from '../components/home/AdvantageCards';
import TrustedBy from '../components/home/TrustedBy';
import Categories from '../components/home/Categories';
import PartnerBanner from '../components/home/PartnerCta';
import { AdventureGrid } from '../components/sections';

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <SafetySection />
      <TestimonialGrid />
      <SeasonTreks />
      <AdventureGrid />
      <FaqGrid />
      <ReasonsRow />
      <AdvantageCards />
      <TrustedBy />
      <Categories />
      <PartnerBanner />
      <DownloadBar />
    </>
  );
}