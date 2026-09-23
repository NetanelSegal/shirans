import { Check } from 'lucide-react';
import { Navigate, useLocation } from 'react-router-dom';
import PageSeo from '@/components/Seo/PageSeo';
import EnterAnimation from '@/components/animations/EnterAnimation';
import FavoriteProjects from '@/components/FavoriteProjects';
import { Faq } from '@/components/ui/Faq';
import { IconCircle, LineIcon } from '@/components/ui/LineIcon';
import { PageHero } from '@/components/ui/PageHero';
import { Photo } from '@/components/ui/Photo';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getPageMeta, type StaticPagePath } from '@/constants/pageMeta';
import { getServicePage, type ServicePage } from '@/data/service-pages';
import { cn } from '@/lib/cn';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * The layout every service page shares. Which blocks appear is decided by the
 * entry in data/service-pages.ts, not here — a page without a checklist or a
 * closing note simply leaves those fields out.
 */
function ServiceDetailPage({ page }: { page: ServicePage }) {
  const path = `/${page.slug}`;
  const meta = getPageMeta(path as StaticPagePath);

  return (
    <>
      <PageSeo title={meta.title} description={meta.description} path={path} />
      <PageHero
        titleId={`${page.slug}-hero-title`}
        image={page.hero}
        title={page.title}
        subtitle={page.subtitle}
        tagline={page.tagline}
      />

      {/* Who it's for. */}
      <Section aria-labelledby={`${page.slug}-intro-heading`}>
        <EnterAnimation>
          <div className='grid items-center gap-10 md:grid-cols-2 md:gap-16'>
            <Photo
              image={page.intro.image}
              sizes='(min-width: 768px) 50vw, 100vw'
              className='aspect-[4/3] w-full shadow-card'
            />
            <div className='flex flex-col gap-5'>
              <SectionHeading
                id={`${page.slug}-intro-heading`}
                title={page.intro.title}
                align='start'
              />
              {page.intro.body.map((paragraph) => (
                <p key={paragraph} className='max-w-measure text-body text-ink-muted'>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </EnterAnimation>
      </Section>

      {/* What the service includes. */}
      <Section tone='soft' aria-labelledby={`${page.slug}-includes-heading`}>
        <EnterAnimation>
          <SectionHeading
            id={`${page.slug}-includes-heading`}
            title={page.includes.title}
            subtitle={page.includes.subtitle}
            className='mb-10 md:mb-14'
          />
          <ul
            className={cn(
              'grid gap-px bg-line/70 sm:grid-cols-2',
              page.includes.items.length === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4',
            )}
          >
            {page.includes.items.map((item) => (
              <li key={item.title} className='flex flex-col items-center gap-3 bg-surface-soft px-5 py-8 text-center'>
                <LineIcon name={item.icon} className='size-9 text-accent' />
                <h3 className='text-h3 text-ink'>{item.title}</h3>
                <p className='text-small text-ink-muted'>{item.description}</p>
              </li>
            ))}
          </ul>
        </EnterAnimation>
      </Section>

      {/* How it works. */}
      <Section aria-labelledby={`${page.slug}-steps-heading`}>
        <EnterAnimation>
          <SectionHeading
            id={`${page.slug}-steps-heading`}
            title={page.steps.title}
            subtitle={page.steps.subtitle}
            className='mb-10 md:mb-14'
          />
          <ol className='relative'>
            <span aria-hidden className='absolute bottom-6 top-6 start-6 w-px bg-line' />
            {page.steps.items.map((step, index) => (
              <li key={step.title} className='relative grid grid-cols-[3rem_1fr] gap-x-5 py-5 md:gap-x-8'>
                <IconCircle variant='soft' className='relative z-10 self-start text-body font-semibold'>
                  <span dir='ltr'>{pad(index + 1)}</span>
                </IconCircle>
                <div className='flex flex-col gap-2 pt-2'>
                  <h3 className='text-h3 text-ink'>{step.title}</h3>
                  <p className='max-w-measure text-body text-ink-muted'>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </EnterAnimation>
      </Section>

      {/* The ticked list, where the page has one. */}
      {page.checklist && (
        <Section tone='sunken' aria-labelledby={`${page.slug}-checklist-heading`}>
          <EnterAnimation>
            <div className='grid items-center gap-10 md:grid-cols-2 md:gap-16'>
              <div className='flex flex-col gap-5'>
                <SectionHeading
                  id={`${page.slug}-checklist-heading`}
                  title={page.checklist.title}
                  align='start'
                />
                {page.checklist.body && (
                  <p className='max-w-measure text-body text-ink-muted'>{page.checklist.body}</p>
                )}
                <ul className='flex flex-col gap-3'>
                  {page.checklist.items.map((item) => (
                    <li key={item} className='flex items-start gap-3 text-body text-ink-muted'>
                      <Check aria-hidden className='mt-1 size-5 shrink-0 text-accent' strokeWidth={1.5} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Photo
                image={page.checklist.image}
                sizes='(min-width: 768px) 50vw, 100vw'
                className='aspect-[4/3] w-full shadow-card md:order-first'
              />
            </div>
          </EnterAnimation>
        </Section>
      )}

      {page.showProjects && (
        <Section tone='soft' aria-label='פרויקטים נבחרים'>
          <EnterAnimation>
            {/* Brings its own heading and "לכל הפרויקטים" link. */}
            <FavoriteProjects />
          </EnterAnimation>
        </Section>
      )}

      {/* Questions, beside the closing note where there is one. */}
      <Section aria-labelledby={`${page.slug}-faq-heading`}>
        <EnterAnimation>
          <div className={cn('grid gap-10', page.note && 'lg:grid-cols-[1.3fr_1fr] lg:gap-16')}>
            <div>
              <SectionHeading
                id={`${page.slug}-faq-heading`}
                title='שאלות נפוצות'
                align='start'
                className='mb-8'
              />
              <Faq items={page.faq} />
            </div>
            {page.note && (
              <aside className='self-start bg-surface-sunken p-7 md:p-9'>
                <h2 className='text-h3 text-ink'>{page.note.title}</h2>
                <p className='mt-4 text-body text-ink-muted'>{page.note.body}</p>
                <p className='mt-6 text-small font-semibold text-accent-strong'>— שירן גלעד</p>
              </aside>
            )}
          </div>
        </EnterAnimation>
      </Section>
    </>
  );
}

/** Resolves the slug from the URL; an unknown one falls through to /services. */
export default function ServiceDetail() {
  const { pathname } = useLocation();
  const page = getServicePage(pathname.replace(/^\/|\/$/g, ''));
  if (!page) return <Navigate to='/services' replace />;
  return <ServiceDetailPage page={page} />;
}
