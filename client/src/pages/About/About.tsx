import { Helmet } from 'react-helmet-async';
import EnterAnimation from '@/components/animations/EnterAnimation';
import { BASE_URL } from '@/constants/urls';
import AboutHeroSection from './sections/AboutHeroSection';
import AboutVisionSection from './sections/AboutVisionSection';
import AboutStorySection from './sections/AboutStorySection';
import AboutServicesSection from './sections/AboutServicesSection';
import AboutCtaSection from './sections/AboutCtaSection';

export default function About() {
  return (
    <>
      <Helmet>
        <title>אודות - שירן גלעד אדריכלות ועיצוב פנים</title>
        <meta
          name="description"
          content="שירן גלעד — אדריכלית ומעצבת פנים לבניה פרטית. מעל 10 שנות ניסיון בליווי משפחות מתכנון נכון ועד הבית המוגמר."
        />
        <meta
          property="og:title"
          content="אודות - שירן גלעד אדריכלות ועיצוב פנים"
        />
        <meta
          property="og:description"
          content="שירן גלעד — אדריכלית ומעצבת פנים לבניה פרטית. מעל 10 שנות ניסיון בליווי משפחות מתכנון נכון ועד הבית המוגמר."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${BASE_URL}/about`} />
        <meta
          property="og:image"
          content={`${BASE_URL}/assets/shiranImage-28AXxNS6.jpeg`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="אודות - שירן גלעד אדריכלות ועיצוב פנים"
        />
        <meta
          name="twitter:description"
          content="שירן גלעד — אדריכלית ומעצבת פנים לבניה פרטית. מעל 10 שנות ניסיון בליווי משפחות מתכנון נכון ועד הבית המוגמר."
        />
        <meta
          name="twitter:image"
          content={`${BASE_URL}/assets/shiranImage-28AXxNS6.jpeg`}
        />
      </Helmet>

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
