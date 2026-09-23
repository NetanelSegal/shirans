import { ReactNode } from 'react';
import { Container } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { FeatureStrip, Feature } from '@/components/ui/FeatureStrip';
import { Photo } from '@/components/ui/Photo';
import { SITE_IMAGES } from '@/constants/siteImages';
import { aboutCta } from '@/data/about-content';
import { SERVICE_PAGES } from '@/data/service-pages';
import { ContactForm } from './ContactForm';

interface BandCopy {
  title: ReactNode;
  subtitle: ReactNode;
}

const DEFAULT_COPY: BandCopy = {
  title: 'מתחילים לתכנן את הבית שלכם?',
  subtitle: 'אני כאן ללוות אתכם בדרך לבית שמתאים בדיוק לכם.',
};

const SHOWCASE_COPY: BandCopy = {
  title: 'רוצים לראות איך זה יכול להיראות אצלכם?',
  subtitle: 'בואו נדבר על הפרויקט הבא שלכם.',
};

/** The heading each page closes on; unlisted pages use the default. */
const COPY_BY_PATH: Record<string, BandCopy> = {
  '/about': { title: aboutCta.title, subtitle: aboutCta.description },
  '/projects': SHOWCASE_COPY,
  '/process': SHOWCASE_COPY,
  '/services': SHOWCASE_COPY,
  ...Object.fromEntries(
    SERVICE_PAGES.map((page) => [`/${page.slug}`, { title: page.cta.title, subtitle: page.cta.subtitle }]),
  ),
};

const PROMISES: Feature[] = [
  { icon: 'pin', title: 'עבודה בכל הארץ' },
  { icon: 'heart', title: 'יחס אישי ומקצועי' },
  { icon: 'calendar', title: 'שיחת ייעוץ ללא התחייבות' },
];

/**
 * The closing band on every page: an invitation on navy, and the form on a
 * card over a photo. The heading changes per page; everything else is the same
 * band, so there is one contact form on the site, not one per page.
 */
export function ContactBand({ path }: { path: string }) {
  const { title, subtitle } =
    COPY_BY_PATH[path] ?? (path.startsWith('/projects/') ? SHOWCASE_COPY : DEFAULT_COPY);
  return (
    <section
      aria-labelledby='contact-band-title'
      className='relative isolate overflow-hidden bg-primary-deep text-on-dark'
    >
      {/* The photo fills the far half on desktop and sits behind the form card. */}
      <div className='absolute inset-y-0 end-0 -z-10 hidden w-1/2 lg:block'>
        <Photo image={SITE_IMAGES.ctaHouse} sizes='50vw' className='size-full' />
        <div aria-hidden className='absolute inset-0 bg-primary-deep/25' />
      </div>

      <Container className='grid items-center gap-10 py-section lg:grid-cols-2 lg:gap-16'>
        <div className='flex flex-col items-center gap-5 text-center lg:pe-6'>
          <h2 id='contact-band-title' className='text-h1 text-balance text-on-dark'>
            {title}
          </h2>
          <p className='max-w-measure text-lead text-on-dark/80'>{subtitle}</p>
          <FeatureStrip items={PROMISES} tone='dark' size='sm' className='mt-6 w-full max-w-lg' />
        </div>

        <Card className='mx-auto w-full max-w-md p-6 text-ink shadow-overlay md:p-8 lg:ms-auto lg:me-0'>
          <h3 className='text-h3 text-center text-ink'>לקביעת שיחת היכרות</h3>
          <p className='mb-5 mt-1 text-center text-small text-ink-muted'>
            מלאו פרטים ואחזור אליכם בהקדם
          </p>
          <ContactForm />
        </Card>
      </Container>
    </section>
  );
}
