import EnterAnimation from '@/components/animations/EnterAnimation';
import PageSeo from '@/components/Seo/PageSeo';
import AboutHeroSection from './sections/AboutHeroSection';
import AboutVisionSection from './sections/AboutVisionSection';
import AboutStorySection from './sections/AboutStorySection';
import AboutServicesSection from './sections/AboutServicesSection';
import AboutCtaSection from './sections/AboutCtaSection';
import { getPageMeta } from '@/constants/pageMeta';

const PAGE_META = getPageMeta('/about');

export default function About() {
  return (
    <>
      <PageSeo
        title={PAGE_META.title}
        description={PAGE_META.description}
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
