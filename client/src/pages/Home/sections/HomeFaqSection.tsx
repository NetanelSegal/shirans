import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Faq } from '@/components/ui/Faq';
import { FaqStructuredData } from '@/components/Seo/StructuredData';
import { homeFaq } from '@/data/home-content';

/**
 * The questions people ask before they build, each with a link to the page
 * that answers it at length. Also tells search engines it is an FAQ.
 */
export default function HomeFaqSection() {
  return (
    <Section aria-labelledby='home-faq-heading'>
      <FaqStructuredData faq={homeFaq.items} />
      <div className='mx-auto max-w-3xl'>
        <SectionHeading id='home-faq-heading' title={homeFaq.title} subtitle={homeFaq.subtitle} className='mb-10' />
        <Faq items={homeFaq.items} />
      </div>
    </Section>
  );
}
