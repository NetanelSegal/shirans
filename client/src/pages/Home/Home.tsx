import EnterAnimation from '@/components/animations/EnterAnimation';
import HeroSection from './sections/HeroSection';
import WhoIsShiranSection from './sections/WhoIsShiranSection';
import FavoriteProjectsSection from './sections/FavoriteProjectsSection';
import ProcessSection from './sections/ProcessSection';
import ServicesSection from './sections/ServicesSection';
import FeedbackCarousel from '@/pages/Home/sections/TestimonialsSection';

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

const feedbacks = [
  {
    id: 1,
    name: 'שירן כהן',
    role: 'לקוחה',
    message:
      'העבודה של שירן פשוט מדהימה! השיפוץ שעשינו בדירה עבר בצורה חלקה ומקצועית. ממליצה בחום!',
  },
  {
    id: 2,
    name: 'דניאל לוי',
    role: 'לקוח',
    message:
      'התוצאה הסופית עברה את כל הציפיות. שירן הקשיבה לכל הבקשות שלנו ויישמה אותן בצורה מושלמת.',
  },
];
