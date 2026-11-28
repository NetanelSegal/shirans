import { ButtonLink } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProcessStepper } from '../components/ProcessStepper';

export default function ProcessSection() {
  return (
    <Section tone='sunken' aria-labelledby='home-process-heading'>
      <div className='mx-auto flex max-w-5xl flex-col gap-8'>
        <SectionHeading
          id='home-process-heading'
          title='התהליך מתחילתו ועד סופו'
          subtitle='בחרו שלב ותראו מה קורה בו וכמה זמן הוא לוקח.'
          align='start'
        />
        <ProcessStepper />
        <ButtonLink to='/process' variant='primary' arrow className='self-start'>
          כל הפרטים על התהליך
        </ButtonLink>
      </div>
    </Section>
  );
}
