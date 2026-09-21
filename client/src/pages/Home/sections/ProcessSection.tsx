import { ButtonLink } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProcessTimeline } from '@/components/Process/ProcessTimeline';
import { SITE_IMAGES } from '@/constants/siteImages';

export default function ProcessSection() {
  return (
    <Section tone='sunken' aria-labelledby='home-process-heading'>
      <div className='grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20'>
        <div className='flex flex-col gap-8'>
          <SectionHeading id='home-process-heading' title='התהליך מתחילתו ועד סופו' align='start' />
          <ProcessTimeline />
          <ButtonLink to='/process' variant='primary' arrow className='self-start'>
            עוד על התהליך
          </ButtonLink>
        </div>
        <div className='relative hidden lg:block'>
          <Photo
            image={SITE_IMAGES.shiranKitchen}
            sizes='45vw'
            className='sticky top-[calc(var(--nav-height)+2rem)] aspect-[4/5] w-full rounded-card shadow-raised'
            style={{ objectPosition: '62% center' }}
          />
        </div>
      </div>
    </Section>
  );
}
