import PageSeo from '@/components/Seo/PageSeo';
import EnterAnimation from '@/components/animations/EnterAnimation';
import { ServiceScope } from '@/components/Services/ServiceScope';
import { ButtonLink } from '@/components/ui/Button';
import { LineIcon } from '@/components/ui/LineIcon';
import { PageHero } from '@/components/ui/PageHero';
import { Photo } from '@/components/ui/Photo';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getPageMeta } from '@/constants/pageMeta';
import { SERVICES } from '@/constants/services';
import { SITE_IMAGES } from '@/constants/siteImages';
import { cn } from '@/lib/cn';

const PAGE_META = getPageMeta('/services');

export default function Services() {
  return (
    <>
      <PageSeo title={PAGE_META.title} description={PAGE_META.description} path='/services' />
      <PageHero
        titleId='services-hero-title'
        image={SITE_IMAGES.servicesHero}
        title='שירותים'
        subtitle='מענה מקיף לכל שלב בדרך לבית שלכם'
      />

      <Section aria-label='השירותים' spacing='tight'>
        <ol className='flex flex-col gap-6 md:gap-8'>
          {SERVICES.map((service, index) => (
            <li key={service.id} id={service.id} className='scroll-mt-[calc(var(--nav-height)+1.5rem)]'>
              <EnterAnimation>
                <article className='grid items-center overflow-hidden rounded-card bg-surface-soft shadow-card md:grid-cols-2'>
                  <Photo
                    image={service.image}
                    sizes='(min-width: 768px) 50vw, 100vw'
                    className={cn('aspect-[16/10] size-full', index % 2 === 1 && 'md:order-last')}
                  />
                  <div className='flex flex-col items-start gap-4 p-7 md:p-12'>
                    <LineIcon name={service.icon} className='size-9 text-accent' />
                    <h2 className='text-h2 text-ink'>{service.title}</h2>
                    <p className='text-lead text-ink-muted'>{service.description}</p>
                    <ButtonLink to='/contact' variant='secondary' size='sm' arrow className='mt-2'>
                      לשיחת היכרות
                    </ButtonLink>
                  </div>
                </article>
              </EnterAnimation>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone='soft' aria-labelledby='scope-heading'>
        <SectionHeading id='scope-heading' title='מה כולל הליווי' className='mb-10 md:mb-14' />
        <ServiceScope />
      </Section>
    </>
  );
}
