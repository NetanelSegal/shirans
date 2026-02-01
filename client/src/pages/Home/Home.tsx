import EnterAnimation from '@/components/animations/EnterAnimation';
import HeroSection from './sections/HeroSection';
import WhoIsShiranSection from './sections/WhoIsShiranSection';
import FavoriteProjectsSection from './sections/FavoriteProjectsSection';
import ProcessSection from './sections/ProcessSection';
import ServicesSection from './sections/ServicesSection';
import FeedbackCarousel from '@/pages/Home/sections/TestimonialsSection';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '@/constants/urls';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>שירן גלעד - אדריכלות ועיצוב פנים | תכנון בתים פרטיים</title>
        <meta name="description" content="שירן גלעד - מתמחה באדריכלות ועיצוב פנים מאז 2015. תכנון בתים פרטיים, דירות יוקרה,נטהאוזים בהתאמה אישית." />
        <meta property="og:title" content="שירן גלעד - אדריכלות ועיצוב פנים | תכנון בתים פרטיים" />
        <meta property="og:description" content="שירן גלעד - מתמחה באדריכלות ועיצוב פנים מאז 2015. תכנון בתים פרטיים, דירות יוקרה,נטהאוזים בהתאמה אישית." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${BASE_URL}/`} />
        <meta property="og:image" content={`${BASE_URL}/assets/shiranImage-28AXxNS6.jpeg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="שירן גלעד - אדריכלות ועיצוב פנים | תכנון בתים פרטיים" />
        <meta name="twitter:description" content="שירן גלעד - מתמחה באדריכלות ועיצוב פנים מאז 2015. תכנון בתים פרטיים, דירות יוקרה,נטהאוזים בהתאמה אישית." />
        <meta name="twitter:image" content={`${BASE_URL}/assets/shiranImage-28AXxNS6.jpeg`} />
      </Helmet>
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
