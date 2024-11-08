import HeroSection from './components/A_HeroSection';
import WhoIsShiranSection from './components/B_WhoIsShiranSection';
import FavoriteProjectsSection from './components/C_FavoriteProjectsSection';

export default function Home() {
  return (
    <div className='px-page-all'>
      <HeroSection />
      <WhoIsShiranSection />
      <FavoriteProjectsSection />
    </div>
  );
}
