import HeroSection from './sections/HeroSection';
import WhoIsShiranSection from './sections/WhoIsShiranSection';
import ServicesSection from './sections/ServicesSection';
import FavoriteProjectsSection from './sections/FavoriteProjectsSection';
import ProcessSection from './sections/ProcessSection';
import TestimonialsSection from '@/pages/Home/sections/TestimonialsSection';
import EnterAnimation from '@/components/animations/EnterAnimation';
import PageSeo from '@/components/Seo/PageSeo';
import { getPageMeta } from '@/constants/pageMeta';

const PAGE_META = getPageMeta('/');

export default function Home() {
  return (
    <>
      <PageSeo title={PAGE_META.title} description={PAGE_META.description} path='/' />
      <HeroSection />
      <EnterAnimation>
        <WhoIsShiranSection />
      </EnterAnimation>
      <EnterAnimation>
        <ServicesSection />
      </EnterAnimation>
      <EnterAnimation>
        <FavoriteProjectsSection />
      </EnterAnimation>
      <EnterAnimation>
        <ProcessSection />
      </EnterAnimation>
      <EnterAnimation>
        <TestimonialsSection />
      </EnterAnimation>
    </>
  );
}
