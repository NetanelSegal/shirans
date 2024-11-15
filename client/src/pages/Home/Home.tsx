import HeroSection from './sections/A_HeroSection';
import WhoIsShiranSection from './sections/B_WhoIsShiranSection';
import FavoriteProjectsSection from './sections/C_FavoriteProjectsSection';
import ProcessSection from './sections/D_ProcessSection';

export default function Home() {
  return (
    <div className='px-page-all overflow-hidden'>
      <HeroSection />
      <WhoIsShiranSection />
      <FavoriteProjectsSection />
      <ProcessSection />
    </div>
  );
}
