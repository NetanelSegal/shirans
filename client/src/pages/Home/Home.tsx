import HeroSection from './sections/A_HeroSection';
import WhoIsShiranSection from './sections/B_WhoIsShiranSection';
import FavoriteProjectsSection from './sections/C_FavoriteProjectsSection';
import ProcessSection from './sections/D_ProcessSection';
import ServicesSection from './sections/E_ServicesSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <WhoIsShiranSection />
      <FavoriteProjectsSection />
      <ProcessSection />
      <ServicesSection />
    </>
  );
}
