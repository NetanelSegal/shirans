import EnterAnimation from '@/components/animations/EnterAnimation';
import HeroSection from './sections/HeroSection';
import WhoIsShiranSection from './sections/WhoIsShiranSection';
import FavoriteProjectsSection from './sections/FavoriteProjectsSection';
import ProcessSection from './sections/ProcessSection';
import ServicesSection from './sections/ServicesSection';
import FeedbackCarousel from '@/pages/Home/sections/TestimonialsSection';
import PageSeo from '@/components/Seo/PageSeo';

const HOME_TITLE = 'שירן גלעד - אדריכלות ועיצוב פנים | תכנון בתים פרטיים';
const HOME_DESCRIPTION =
  'שירן גלעד - מתמחה באדריכלות ועיצוב פנים מאז 2015. תכנון בתים פרטיים, דירות יוקרה, ופנטהאוזים בהתאמה אישית.';

export default function Home() {
  return (
    <>
      <PageSeo
        title={HOME_TITLE}
        description={HOME_DESCRIPTION}
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
