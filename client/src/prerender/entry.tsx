/* eslint-disable react-refresh/only-export-components -- build-time module, never hot-reloaded */
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { aboutHero, aboutServices, aboutStory, aboutVision } from '@/data/about-content';
import { content as processSteps } from '@/data/process-info';
import { SERVICE_PAGES, type ServicePage } from '@/data/service-pages';
import { getServiceGuide } from '@/data/service-guides';
import { fallbackTestimonials } from '@/data/shiran.testimonials';
import { SERVICES } from '@/constants/services';
import { EMAIL, PHONE_DISPLAY, PHONE_HREF } from '@/constants/contact';
import { getPageMeta, type StaticPagePath } from '@/constants/pageMeta';
import {
  breadcrumbJsonLd,
  businessJsonLd,
  serviceJsonLd,
  type JsonLd,
} from '@/lib/structuredData';

/** Articles that live in code; the build writes their pages like the API's. */
export { BUILTIN_ARTICLES } from '@/data/builtin-articles';

/**
 * Build-time HTML for crawlers.
 *
 * The site is a single-page app: without this, every page's HTML is an empty
 * <div id="root"> until JavaScript runs, and search engines that don't run it
 * (or run it days later) see no text at all. scripts/generate-share-pages.mjs
 * calls these functions after `vite build` and writes the markup into each
 * route's root element, plus the page's JSON-LD into its <head>.
 *
 * This is a plain, readable version of each page built from the same data
 * files the React pages render, not a copy of their layout. The app replaces
 * it with `createRoot().render()` as soon as it starts, so it only shows for
 * the moment before the script runs, and never needs to match the React tree.
 */

export interface PrerenderedPage {
  path: string;
  html: string;
  jsonLd: JsonLd[];
}

const NAV_LINKS: { href: string; label: string }[] = [
  { href: '/', label: 'דף הבית' },
  { href: '/services', label: 'שירותים' },
  { href: '/projects', label: 'פרויקטים' },
  { href: '/process', label: 'התהליך' },
  { href: '/about', label: 'אודות' },
  { href: '/blog', label: 'מגזין' },
  { href: '/calculator', label: 'מחשבון עלות' },
  { href: '/contact', label: 'צור קשר' },
];

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className='mx-auto max-w-3xl px-6 py-10 text-ink'>
      <nav aria-label='ניווט ראשי' className='mb-10'>
        <ul className='flex flex-wrap gap-x-5 gap-y-2 text-small'>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <main className='flex flex-col gap-10'>{children}</main>
      <footer className='mt-16 flex flex-col gap-2 text-small text-ink-muted'>
        <p>שירן גלעד · אדריכלות ועיצוב פנים לבתים פרטיים · עבודה בכל הארץ</p>
        <p>
          טלפון: <a href={PHONE_HREF}>{PHONE_DISPLAY}</a> · דוא״ל: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </footer>
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className='flex flex-col gap-4'>
      <h2 className='text-h2'>{title}</h2>
      {children}
    </section>
  );
}

const Paragraphs = ({ items }: { items: string[] }) => (
  <>
    {items.map((text) => (
      <p key={text} className='text-body text-ink-muted'>
        {text}
      </p>
    ))}
  </>
);

/** **bold** markers in process-info are for the React page; plain text here. */
const plain = (text: string) => text.replace(/\*\*/g, '').trim();

function ServiceLinks() {
  return (
    <ul className='flex flex-col gap-3'>
      {SERVICES.map((service) => (
        <li key={service.id}>
          <a href={service.href}>{service.title}</a> — {service.description}
        </li>
      ))}
    </ul>
  );
}

const render = (node: ReactNode) => renderToStaticMarkup(<Shell>{node}</Shell>);

function homePage(): PrerenderedPage {
  return {
    path: '/',
    html: render(
      <>
        <header className='flex flex-col gap-4'>
          <p className='text-small'>שירן גלעד · אדריכלות ועיצוב פנים</p>
          <h1 className='text-h1'>אדריכלות ועיצוב פנים לבית פרטי שמרגיש בדיוק שלכם</h1>
          <p className='text-lead text-ink-muted'>
            אדריכלות ועיצוב פנים בהתאמה אישית — לאנשים, למקום ולסיפור שלהם.
          </p>
        </header>
        <Block title='שירן גלעד'>
          <p className='text-body text-ink-muted'>{aboutHero.intro}</p>
          <Paragraphs items={aboutStory.paragraphs.slice(0, 2)} />
          <a href='/about'>עוד עליי</a>
        </Block>
        <Block title='השירותים שלי'>
          <ServiceLinks />
        </Block>
        <Block title='התהליך מתחילתו ועד סופו'>
          <ol className='flex flex-col gap-3'>
            {processSteps.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong>: {plain(step.shortText)}
              </li>
            ))}
          </ol>
          <a href='/process'>לתהליך המלא</a>
        </Block>
        <Block title='מה אומרים עלינו'>
          {fallbackTestimonials.map((testimonial) => (
            <blockquote key={testimonial.name} className='text-body text-ink-muted'>
              <p>{testimonial.message}</p>
              <footer>— {testimonial.name}</footer>
            </blockquote>
          ))}
        </Block>
        <Block title='מתחילים לתכנן את הבית שלכם?'>
          <p className='text-body text-ink-muted'>
            <a href='/contact'>השאירו פרטים</a> או התקשרו <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>.
          </p>
        </Block>
      </>,
    ),
    jsonLd: [businessJsonLd()],
  };
}

function servicePage(page: ServicePage): PrerenderedPage {
  const path = `/${page.slug}`;
  const meta = getPageMeta(path as StaticPagePath);
  const guide = getServiceGuide(page.slug);
  return {
    path,
    html: render(
      <>
        <header className='flex flex-col gap-4'>
          <h1 className='text-h1'>{page.title}</h1>
          <p className='text-lead text-ink-muted'>{page.subtitle}</p>
          <p className='text-body'>10 שנות ניסיון · +40 לקוחות מרוצים</p>
        </header>
        <Block title={page.intro.title}>
          <Paragraphs items={page.intro.body} />
        </Block>
        <Block title={page.includes.title}>
          <ul className='flex flex-col gap-3'>
            {page.includes.items.map((item) => (
              <li key={item.title}>
                <h3 className='text-h3'>{item.title}</h3>
                <p className='text-body text-ink-muted'>{item.description}</p>
              </li>
            ))}
          </ul>
        </Block>
        <Block title={page.steps.title}>
          <p className='text-body text-ink-muted'>{page.steps.subtitle}</p>
          <ol className='flex flex-col gap-3'>
            {page.steps.items.map((step) => (
              <li key={step.title}>
                <h3 className='text-h3'>{step.title}</h3>
                <p className='text-body text-ink-muted'>{step.description}</p>
              </li>
            ))}
          </ol>
        </Block>
        {guide && (
          <Block title={guide.title}>
            {guide.sections.map((section) => (
              <div key={section.heading} className='flex flex-col gap-3'>
                <h3 className='text-h3'>{section.heading}</h3>
                <Paragraphs items={section.paragraphs} />
              </div>
            ))}
          </Block>
        )}
        {page.checklist && (
          <Block title={page.checklist.title}>
            {page.checklist.body && <p className='text-body text-ink-muted'>{page.checklist.body}</p>}
            <ul className='flex flex-col gap-2'>
              {page.checklist.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Block>
        )}
        <Block title='שאלות נפוצות'>
          {page.faq.map((item) => (
            <div key={item.question} className='flex flex-col gap-2'>
              <h3 className='text-h3'>{item.question}</h3>
              <p className='text-body text-ink-muted'>{item.answer}</p>
            </div>
          ))}
        </Block>
        {page.note && (
          <Block title={page.note.title}>
            <p className='text-body text-ink-muted'>{page.note.body}</p>
          </Block>
        )}
        <Block title={page.cta.title}>
          <p className='text-body text-ink-muted'>
            {page.cta.subtitle}: <a href='/contact'>לקביעת שיחת היכרות</a> או{' '}
            <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>.
          </p>
        </Block>
        <Block title='שירותים נוספים'>
          <ServiceLinks />
        </Block>
      </>,
    ),
    jsonLd: [
      businessJsonLd(),
      serviceJsonLd({ name: page.title, description: meta.description, path, faq: page.faq }),
    ],
  };
}

function simplePage(path: StaticPagePath, crumb: string, body: ReactNode): PrerenderedPage {
  return {
    path,
    html: render(body),
    jsonLd: [businessJsonLd(), breadcrumbJsonLd([{ name: crumb, path }])],
  };
}

/** Every page whose content lives in the code, not the database. */
export function staticPages(): PrerenderedPage[] {
  return [
    homePage(),
    ...SERVICE_PAGES.map(servicePage),
    simplePage(
      '/services',
      'שירותים',
      <>
        <h1 className='text-h1'>שירותי אדריכלות ועיצוב פנים</h1>
        <p className='text-lead text-ink-muted'>{getPageMeta('/services').description}</p>
        <ServiceLinks />
        <a href='/blog/architect-fees'>כמה עולה אדריכל לבית פרטי?</a>
      </>,
    ),
    simplePage(
      '/about',
      'אודות',
      <>
        <h1 className='text-h1'>{aboutHero.title}</h1>
        <p className='text-lead text-ink-muted'>{aboutHero.intro}</p>
        <Block title={aboutVision.title}>
          <p className='text-body text-ink-muted'>{aboutVision.intro}</p>
          <ul className='flex flex-col gap-2'>
            {aboutVision.pillars.map((pillar) => (
              <li key={pillar.id}>
                <strong>{pillar.title}</strong>: {pillar.description}
              </li>
            ))}
          </ul>
        </Block>
        <Block title={aboutStory.title}>
          <Paragraphs items={aboutStory.paragraphs} />
        </Block>
        <Block title={aboutServices.title}>
          <ul className='flex flex-col gap-2'>
            {aboutServices.items.map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        </Block>
      </>,
    ),
    simplePage(
      '/process',
      'התהליך',
      <>
        <h1 className='text-h1'>התהליך</h1>
        <p className='text-lead text-ink-muted'>{getPageMeta('/process').description}</p>
        <ol className='flex flex-col gap-8'>
          {processSteps.map((step) => (
            <li key={step.title} className='flex flex-col gap-2'>
              <h2 className='text-h2'>{step.title}</h2>
              <p className='text-body text-ink-muted'>{plain(step.longText)}</p>
            </li>
          ))}
        </ol>
      </>,
    ),
    simplePage(
      '/contact',
      'יצירת קשר',
      <>
        <h1 className='text-h1'>בואו נדבר על הבית שלכם</h1>
        <p className='text-lead text-ink-muted'>{getPageMeta('/contact').description}</p>
        <p className='text-body'>
          טלפון: <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
        </p>
        <p className='text-body'>
          דוא״ל: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </>,
    ),
    simplePage(
      '/calculator',
      'מחשבון עלות',
      <>
        <h1 className='text-h1'>מחשבון אומדן עלות לבניית בית פרטי</h1>
        <p className='text-lead text-ink-muted'>{getPageMeta('/calculator').description}</p>
      </>,
    ),
  ];
}

export interface ProjectSummary {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string;
}

export function projectsIndexPage(projects: ProjectSummary[]): PrerenderedPage {
  return simplePage(
    '/projects',
    'פרויקטים',
    <>
      <h1 className='text-h1'>פרויקטים</h1>
      <p className='text-lead text-ink-muted'>{getPageMeta('/projects').description}</p>
      <ul className='flex flex-col gap-6'>
        {projects.map((project) => (
          <li key={project.id} className='flex flex-col gap-2'>
            <h2 className='text-h2'>
              <a href={`/projects/${project.id}`}>{project.title}</a>
            </h2>
            {project.description && (
              <p className='text-body text-ink-muted'>{project.description.split('\n')[0]}</p>
            )}
          </li>
        ))}
      </ul>
    </>,
  );
}

export function projectPage(project: ProjectSummary): PrerenderedPage {
  const path = `/projects/${project.id}`;
  return {
    path,
    html: render(
      <>
        <h1 className='text-h1'>{project.title}</h1>
        {project.imageUrl && <img src={project.imageUrl} alt={project.title} width={1200} height={630} />}
        <Paragraphs items={String(project.description ?? '').split('\n').filter(Boolean)} />
        <a href='/projects'>לכל הפרויקטים</a>
      </>,
    ),
    jsonLd: [
      businessJsonLd(),
      breadcrumbJsonLd([
        { name: 'פרויקטים', path: '/projects' },
        { name: project.title, path },
      ]),
    ],
  };
}

export interface ArticleSummary {
  slug: string;
  title: string;
  excerpt?: string | null;
  /** HTML from the admin's editor. */
  body?: string | null;
}

export function blogIndexPage(articles: ArticleSummary[]): PrerenderedPage {
  return simplePage(
    '/blog',
    'מגזין',
    <>
      <h1 className='text-h1'>תכנון, בנייה ועיצוב — כל מה שכדאי לדעת</h1>
      <p className='text-lead text-ink-muted'>{getPageMeta('/blog').description}</p>
      <ul className='flex flex-col gap-6'>
        {articles.map((article) => (
          <li key={article.slug} className='flex flex-col gap-2'>
            <h2 className='text-h2'>
              <a href={`/blog/${encodeURIComponent(article.slug)}`}>{article.title}</a>
            </h2>
            {article.excerpt && (
              <p className='text-body text-ink-muted'>{article.excerpt.replace(/<[^>]+>/g, ' ').trim()}</p>
            )}
          </li>
        ))}
      </ul>
    </>,
  );
}

/**
 * The article body is the admin editor's HTML, the same HTML the React page
 * renders; it is inserted as is. Article JSON-LD is already set by the page.
 */
export function articlePage(article: ArticleSummary): PrerenderedPage {
  const path = `/blog/${encodeURIComponent(article.slug)}`;
  return {
    path,
    html: render(
      <article className='flex flex-col gap-6'>
        <a href='/blog'>חזרה למרכז הידע</a>
        <h1 className='text-h1'>{article.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: article.body ?? '' }} />
      </article>,
    ),
    jsonLd: [
      businessJsonLd(),
      breadcrumbJsonLd([
        { name: 'מגזין', path: '/blog' },
        { name: article.title, path },
      ]),
    ],
  };
}
