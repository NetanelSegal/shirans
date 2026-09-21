import EnterAnimation from '@/components/animations/EnterAnimation';
import PageSeo from '@/components/Seo/PageSeo';
import { ServiceScope } from '@/components/Services/ServiceScope';
import { FeatureStrip } from '@/components/ui/FeatureStrip';
import { PageHero } from '@/components/ui/PageHero';
import { Photo } from '@/components/ui/Photo';
import { Section } from '@/components/ui/Section';
import { Eyebrow, SectionHeading } from '@/components/ui/SectionHeading';
import { getPageMeta } from '@/constants/pageMeta';
import { SITE_IMAGES } from '@/constants/siteImages';
import { aboutHero, aboutServices, aboutStory, aboutVision } from '@/data/about-content';

const PAGE_META = getPageMeta('/about');

export default function About() {
  return (
    <>
      <PageSeo title={PAGE_META.title} description={PAGE_META.description} path='/about' />

      <PageHero
        titleId='about-hero-title'
        image={SITE_IMAGES.shiranKitchen}
        focus='60% center'
        title={aboutHero.title}
        subtitle={aboutHero.taglines.join(' ')}
      />

      <EnterAnimation>
        <Section aria-labelledby='vision-heading' container='narrow' containerClassName='max-w-5xl'>
          <SectionHeading id='vision-heading' eyebrow='My vision' title={aboutVision.title} subtitle={aboutVision.intro} />
          <FeatureStrip
            className='mt-12 md:mt-16'
            items={aboutVision.pillars.map(({ icon, title, description }) => ({ icon, title, description }))}
          />
        </Section>
      </EnterAnimation>

      <EnterAnimation>
        <Section
          tone='soft'
          aria-labelledby='story-heading'
          containerClassName='grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20'
        >
          <div className='flex flex-col gap-5'>
            <Eyebrow rule>About me</Eyebrow>
            <h2 id='story-heading' className='text-h1 text-ink'>
              {aboutStory.title}
            </h2>
            <p className='text-lead text-ink'>{aboutHero.intro}</p>
            <div className='flex max-w-2xl flex-col gap-4 text-body text-ink-muted'>
              {aboutStory.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-4 lg:sticky lg:top-[calc(var(--nav-height)+2rem)] lg:self-start'>
            <Photo
              image={SITE_IMAGES.shiranPortrait}
              sizes='(min-width: 1024px) 40vw, 100vw'
              className='aspect-[4/5] w-full rounded-card shadow-raised'
            />
            <figure className='relative overflow-hidden rounded-card'>
              <Photo image={SITE_IMAGES.serviceResidential} sizes='(min-width: 1024px) 40vw, 100vw' className='aspect-[16/9] w-full' />
              <div aria-hidden className='absolute inset-0 bg-gradient-to-l from-primary-deep/85 to-primary-deep/20' />
              <blockquote className='absolute inset-0 flex flex-col justify-center gap-3 p-7 text-h3 font-normal text-on-dark'>
                <span aria-hidden className='h-px w-10 bg-on-dark/60' />
                {aboutHero.taglines.map((line) => (
                  <span key={line} className='block'>
                    {line}
                  </span>
                ))}
              </blockquote>
            </figure>
          </div>
        </Section>
      </EnterAnimation>

      <EnterAnimation>
        <Section aria-labelledby='about-services-heading'>
          <SectionHeading
            id='about-services-heading'
            eyebrow='My services'
            title={aboutServices.title}
            subtitle='כל פרויקט מתחיל בהבנה של איך אתם חיים, מה חשוב לכם, ואיך המשפחה שלכם מתנהלת.'
            className='mb-10 md:mb-14'
          />
          <ServiceScope />
        </Section>
      </EnterAnimation>
    </>
  );
}
