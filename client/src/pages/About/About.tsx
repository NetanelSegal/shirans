import EnterAnimation from '@/components/animations/EnterAnimation';
import PageSeo from '@/components/Seo/PageSeo';
import AboutHeroSection from './sections/AboutHeroSection';
import AboutVisionSection from './sections/AboutVisionSection';
import AboutStorySection from './sections/AboutStorySection';
import AboutServicesSection from './sections/AboutServicesSection';
import AboutCtaSection from './sections/AboutCtaSection';

const ABOUT_TITLE = 'אודות - שירן גלעד אדריכלות ועיצוב פנים';
const ABOUT_DESCRIPTION =
  'שירן גלעד — אדריכלית ומעצבת פנים לבניה פרטית. מעל 10 שנות ניסיון בליווי משפחות מתכנון נכון ועד הבית המוגמר.';

export default function About() {
  return (
    <>
      <PageSeo
        title={ABOUT_TITLE}
        description={ABOUT_DESCRIPTION}
        path="/about"
      />

      <EnterAnimation translateY={false}>
        <AboutHeroSection />
      </EnterAnimation>
      <EnterAnimation>
        <AboutVisionSection />
      </EnterAnimation>
      <EnterAnimation>
        <AboutStorySection />
      </EnterAnimation>
      <AboutServicesSection />
      <EnterAnimation>
        <AboutCtaSection />
      </EnterAnimation>
    </>
  );
}
