import EnterAnimation from '@/components/animations/EnterAnimation';
import HeroSection from './sections/HeroSection';
import WhoIsShiranSection from './sections/WhoIsShiranSection';
import FavoriteProjectsSection from './sections/FavoriteProjectsSection';
import ProcessSection from './sections/ProcessSection';
import ServicesSection from './sections/ServicesSection';
import FeedbackCarousel from '@/pages/Home/sections/TestimonialsSection';
import PageSeo from '@/components/Seo/PageSeo';
import { getPageMeta } from '@/constants/pageMeta';

const PAGE_META = getPageMeta('/');

export default function Home() {
  return (
    <>
      <PageSeo
        title={PAGE_META.title}
        description={PAGE_META.description}
        path="/"
      />
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
        <ServicesSection />
      </EnterAnimation>
      <EnterAnimation>
        <FeedbackCarousel />
      </EnterAnimation>
      <EnterAnimation>
        <ProcessSection />
      </EnterAnimation>
    </>
  );
}
