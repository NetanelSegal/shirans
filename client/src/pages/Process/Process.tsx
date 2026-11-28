import PageSeo from '@/components/Seo/PageSeo';
import { ProcessJourney } from '@/components/Process/ProcessJourney';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { getPageMeta } from '@/constants/pageMeta';
import { SITE_IMAGES } from '@/constants/siteImages';

const PAGE_META = getPageMeta('/process');

export default function Process() {
  return (
    <>
      <PageSeo title={PAGE_META.title} description={PAGE_META.description} path='/process' />
      <PageHero
        titleId='process-hero-title'
        image={SITE_IMAGES.processHero}
        title='התהליך'
        subtitle='גללו ותראו את הבית שלכם נבנה, מהפגישה הראשונה ועד המפתח'
        tagline={['בתים', 'שמחשבים', 'נכון', 'לאנשים', 'אמיתיים']}
      />
      {/* No overflow clip here: the drawing is sticky. */}
      <Section aria-label='שלבי התהליך'>
        <ProcessJourney />
      </Section>
    </>
  );
}
