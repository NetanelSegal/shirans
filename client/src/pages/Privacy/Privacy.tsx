import PageSeo from '@/components/Seo/PageSeo';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/SectionHeading';
import { getPageMeta } from '@/constants/pageMeta';
import { PRIVACY_INTRO, PRIVACY_SECTIONS, PRIVACY_UPDATED } from '@/data/privacy-policy';

const PATH = '/privacy';

/** A page of reading: one narrow column, headings and paragraphs, no photo hero. */
export default function Privacy() {
  const meta = getPageMeta(PATH);

  return (
    <>
      <PageSeo title={meta.title} description={meta.description} path={PATH} />
      <Section container='narrow' className='pt-[calc(var(--nav-height)+2rem)]'>
        <article className='flex flex-col gap-10'>
          <header className='flex flex-col gap-4'>
            <Eyebrow rule>עודכן ב-{PRIVACY_UPDATED}</Eyebrow>
            <h1 className='text-h1 text-balance text-ink'>מדיניות פרטיות</h1>
            <p className='max-w-measure text-lead text-ink-muted'>{PRIVACY_INTRO}</p>
          </header>

          {PRIVACY_SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
              className='flex flex-col gap-3 border-t border-line/60 pt-8'
            >
              <h2 id={`${section.id}-heading`} className='text-h3 text-ink'>
                {section.title}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className='max-w-measure text-body text-ink-muted'>
                  {paragraph}
                </p>
              ))}
              {section.items && (
                <ul className='flex max-w-measure list-disc flex-col gap-2 ps-5 text-body text-ink-muted'>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </Section>
    </>
  );
}
