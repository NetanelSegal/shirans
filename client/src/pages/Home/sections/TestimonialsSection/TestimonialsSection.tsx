import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import Testimonials from '../../components/Testimonials';

const TestimonialsSection = () => {
  return (
    <Section aria-labelledby='testimonials-heading' container='narrow' containerClassName='max-w-5xl'>
      <SectionHeading id='testimonials-heading' title='מה אומרים עלינו' className='mb-10' />
      <Testimonials />
    </Section>
  );
};

export default TestimonialsSection;
