import EnterAnimation from '@/components/animations/EnterAnimation';
import HeroSection from './sections/A_HeroSection';
import WhoIsShiranSection from './sections/B_WhoIsShiranSection';
import FavoriteProjectsSection from './sections/C_FavoriteProjectsSection';
import ProcessSection from './sections/D_ProcessSection';
import ServicesSection from './sections/E_ServicesSection';

export default function Home() {
  return (
    <>
      <EnterAnimation translateY={false}>
        <HeroSection />
      </EnterAnimation>
      <EnterAnimation>
        <WhoIsShiranSection />
      </EnterAnimation>
      <EnterAnimation>
        <FavoriteProjectsSection />
      </EnterAnimation>
      <EnterAnimation>
        <ProcessSection />
      </EnterAnimation>
      <EnterAnimation>
        <ServicesSection />
      </EnterAnimation>
    </>
  );
}
