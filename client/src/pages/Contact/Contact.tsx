import { MessageCircle, Phone } from 'lucide-react';
import PageSeo from '@/components/Seo/PageSeo';
import { ContactDetails } from '@/components/Contact/ContactDetails';
import { ContactForm } from '@/components/Contact/ContactForm';
import { buttonStyles } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Photo } from '@/components/ui/Photo';
import { Container } from '@/components/ui/Section';
import { Rule } from '@/components/ui/SectionHeading';
import { getPageMeta } from '@/constants/pageMeta';
import { PHONE_HREF, WHATSAPP_HREF } from '@/constants/contact';
import { SITE_IMAGES } from '@/constants/siteImages';

const PAGE_META = getPageMeta('/contact');

/**
 * The whole page is one screen: the photo header carries the ways to reach
 * Shiran and the form itself. It used to be a tall photo with only a heading
 * on it, so a visitor who came here to call or write had to scroll past an
 * empty screen to find the number.
 */
export default function Contact() {
  return (
    <>
      <PageSeo title={PAGE_META.title} description={PAGE_META.description} path='/contact' />

      <section
        aria-labelledby='contact-hero-title'
        className='relative isolate overflow-hidden bg-primary-deep text-on-dark'
      >
        <Photo image={SITE_IMAGES.contactHero} priority className='absolute inset-0 -z-20 size-full' />
        {/* Navy wash, heaviest behind the text (start side) and under the
            navbar, so the cream type and the outlined discs stay readable. */}
        <div
          aria-hidden
          className='absolute inset-0 -z-10 bg-gradient-to-l from-primary-deep/95 via-primary-deep/80 to-primary-deep/55'
        />
        <div
          aria-hidden
          className='absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-primary-deep/70 to-transparent'
        />

        <Container className='grid items-center gap-10 pb-12 pt-[calc(var(--nav-height)+2rem)] md:pb-16 lg:min-h-svh lg:grid-cols-[1fr_minmax(0,28rem)] lg:gap-16 lg:pt-[calc(var(--nav-height)+2.5rem)]'>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col gap-3'>
              <h1 id='contact-hero-title' className='text-h1 text-balance text-on-dark'>
                בואו נדבר על הבית שלכם
              </h1>
              <p className='max-w-measure text-lead text-on-dark/85'>
                התקשרו, שלחו הודעה או השאירו פרטים ונחזור אליכם לשיחת ייעוץ ראשונית, ללא התחייבות.
              </p>
            </div>

            {/* The two quickest ways in, before any form. */}
            <div className='flex flex-col gap-3 sm:flex-row'>
              <a
                href={WHATSAPP_HREF}
                target='_blank'
                rel='noopener noreferrer'
                className={buttonStyles({ variant: 'light', className: 'w-full sm:w-auto' })}
              >
                <MessageCircle className='size-5 shrink-0' strokeWidth={1.75} aria-hidden />
                הודעה בוואטסאפ
              </a>
              <a href={PHONE_HREF} className={buttonStyles({ variant: 'outline', className: 'w-full sm:w-auto' })}>
                <Phone className='size-5 shrink-0' strokeWidth={1.75} aria-hidden />
                התקשרו עכשיו
              </a>
            </div>

            <div className='flex max-w-md flex-col gap-2'>
              <Rule className='bg-on-dark/40' />
              <ContactDetails tone='dark' compact />
            </div>
          </div>

          <Card className='w-full p-6 text-ink shadow-overlay md:p-8'>
            <h2 className='text-h3 text-ink'>להשארת פרטים</h2>
            <p className='mb-5 mt-1 text-small text-ink-muted'>מלאו את הפרטים ונחזור אליכם בהקדם.</p>
            <ContactForm />
            <p className='text-center text-small text-ink-subtle'>
              הפרטים שלכם שמורים אצלנו ולא יועברו לגורם אחר.
            </p>
          </Card>
        </Container>
      </section>
    </>
  );
}
