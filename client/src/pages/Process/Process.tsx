import PageSeo from '@/components/Seo/PageSeo';
import { ProcessTimeline } from '@/components/Process/ProcessTimeline';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { getPageMeta } from '@/constants/pageMeta';
import { SITE_IMAGES } from '@/constants/siteImages';
import { Photo } from '@/components/ui/Photo';

const PAGE_META = getPageMeta('/process');

/** One photo per step, from the first meeting to the finished house. */
const STEP_PHOTOS = [
  SITE_IMAGES.processStep1,
  SITE_IMAGES.processStep2,
  SITE_IMAGES.processStep3,
  SITE_IMAGES.processStep4,
  SITE_IMAGES.processStep5,
];

export default function Process() {
  return (
    <>
      <PageSeo title={PAGE_META.title} description={PAGE_META.description} path='/process' />
      <PageHero
        titleId='process-hero-title'
        image={SITE_IMAGES.processHero}
        title='התהליך'
        subtitle='שיטת תיאום ציפיות, תכנון מדויק וביצוע בטוח'
        tagline={['בתים', 'שמחשבים', 'נכון', 'לאנשים', 'אמיתיים']}
      />
      <Section aria-label='שלבי התהליך'>
        <ProcessTimeline
          variant='full'
          aside={(index) => (
            <Photo
              image={STEP_PHOTOS[index]}
              sizes='(min-width: 768px) 40vw, 90vw'
              className='aspect-[3/2] w-full shadow-card'
            />
          )}
        />
      </Section>
    </>
  );
}
