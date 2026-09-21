import { ButtonLink } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/SectionHeading';
import { SITE_IMAGES } from '@/constants/siteImages';

export default function WhoIsShiranSection() {
  return (
    <Section aria-labelledby='who-is-shiran-heading' containerClassName='grid items-center gap-10 md:grid-cols-2 lg:gap-20'>
      <div className='flex flex-col items-start gap-4'>
        <Eyebrow rule>נעים להכיר</Eyebrow>
        <h2 id='who-is-shiran-heading' className='text-h1 text-ink'>
          שירן גלעד
        </h2>
        <p className='text-lead text-ink-muted'>אדריכלית ומעצבת פנים</p>
        <p className='max-w-measure text-body text-ink-muted'>
          עוסקת באדריכלות ועיצוב פנים משנת 2015. מתמחה בתכנון בתים פרטיים, דירות
          יוקרה, ופנטהאוזים. המטרה שלי היא לתכנן עבורכם את הבית שתמיד חלמתם עליו,
          עם דגש על הפרטים הקטנים ביותר, שילוב בין חללים מדוייקים המתאימים לצרכים
          שלכם עם אסטטיקה עיצובית ופרקטיקה.
        </p>
        <ButtonLink to='/about' variant='secondary' arrow className='mt-2'>
          קראו עוד עליי
        </ButtonLink>
      </div>

      <div className='relative md:order-first'>
        <div aria-hidden className='absolute -bottom-4 -start-4 hidden h-2/3 w-2/3 rounded-card border border-accent/50 md:block' />
        <Photo
          image={SITE_IMAGES.shiranPortrait}
          sizes='(min-width: 768px) 45vw, 100vw'
          className='relative aspect-[4/5] w-full rounded-card shadow-raised'
        />
      </div>
    </Section>
  );
}
