import EnterAnimation from '@/components/animations/EnterAnimation';
import HeroSection from './sections/HeroSection';
import WhoIsShiranSection from './sections/WhoIsShiranSection';
import FavoriteProjectsSection from './sections/FavoriteProjectsSection';
import ProcessSection from './sections/ProcessSection';
import ServicesSection from './sections/ServicesSection';
import FeedbackCarousel from '@/pages/Home/sections/TestimonialsSection';
import { usePageMetadata } from '@/hooks/usePageMetadata';

export default function Home() {
  usePageMetadata({
    title: 'שירן גלעד - אדריכלות ועיצוב פנים | תכנון בתים פרטיים',
    description: 'שירן גלעד - מתמחה באדריכלות ועיצוב פנים מאז 2015. תכנון בתים פרטיים, דירות יוקרה,נטהאוזים בהתאמה אישית.',
    ogImage: '/assets/shiranImage-28AXxNS6.jpeg',
  });
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
