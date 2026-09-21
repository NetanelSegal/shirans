import PageSeo from '@/components/Seo/PageSeo';
import { ContactDetails } from '@/components/Contact/ContactDetails';
import { ContactForm } from '@/components/Contact/ContactForm';
import { Card } from '@/components/ui/Card';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Rule } from '@/components/ui/SectionHeading';
import { getPageMeta } from '@/constants/pageMeta';
import { SITE_IMAGES } from '@/constants/siteImages';

const PAGE_META = getPageMeta('/contact');

export default function Contact() {
  return (
    <>
      <PageSeo title={PAGE_META.title} description={PAGE_META.description} path='/contact' />

      <PageHero
        titleId='contact-hero-title'
        image={SITE_IMAGES.contactHero}
        title='צור קשר'
        subtitle='מוזמנים להשאיר פרטים ונחזור אליכם לשיחת ייעוץ ראשונית — ללא התחייבות.'
      />

      <Section containerClassName='grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-4'>
            <h2 className='text-h1 text-ink'>פרטי התקשרות</h2>
            <Rule />
          </div>
          <ContactDetails />
        </div>

        <Card className='bg-surface-soft p-6 md:p-10'>
          <h2 className='text-h2 text-ink'>להשארת פרטים</h2>
          <p className='mb-6 mt-2 text-body text-ink-muted'>מלאו את הפרטים ונחזור אליכם בהקדם.</p>
          <ContactForm />
          <p className='text-center text-small text-ink-subtle'>
            הפרטים שלכם שמורים אצלנו ולא יועברו לגורם אחר.
          </p>
        </Card>
      </Section>
    </>
  );
}
