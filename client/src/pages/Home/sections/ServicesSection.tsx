import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ServicesGrid } from '@/components/Services/ServicesGrid';

export default function ServicesSection() {
  return (
    <Section tone='soft' aria-labelledby='services-heading'>
      <SectionHeading
        id='services-heading'
        title='השירותים שלי'
        subtitle='מענה מקיף לכל שלב בדרך לבית שלכם'
        className='mb-10 md:mb-14'
      />
      <ServicesGrid />
    </Section>
  );
}
