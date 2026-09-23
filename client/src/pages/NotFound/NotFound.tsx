import { useLocation } from 'react-router-dom';
import PageSeo from '@/components/Seo/PageSeo';
import { ButtonLink } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/SectionHeading';

const NOT_FOUND_TITLE = '404 - דף לא נמצא | שירן גלעד אדריכלות ועיצוב פנים';
const NOT_FOUND_DESCRIPTION =
  'הדף שביקשת לא נמצא. חזור לעמוד הבית או עיין בפרויקטים שלנו.';

/**
 * On the site's own shell like every other page. It used to wrap a <Link> in a
 * <Button> — a link inside a button, which is invalid markup and announces as
 * two controls to a screen reader.
 */
export default function NotFound() {
  const { pathname } = useLocation();

  return (
    <>
      <PageSeo
        title={NOT_FOUND_TITLE}
        description={NOT_FOUND_DESCRIPTION}
        path={pathname}
        noIndex
      />
      <Section container='narrow' className='pt-[calc(var(--nav-height)+2rem)]'>
        <div className='flex min-h-[50vh] flex-col items-center justify-center gap-5 text-center'>
          <Eyebrow rule>שגיאה 404</Eyebrow>
          <h1 className='text-h1 text-balance text-ink'>הדף שחיפשתם לא נמצא</h1>
          <p className='max-w-measure text-lead text-ink-muted'>
            ייתכן שהכתובת השתנתה או שהדף הוסר. אפשר לחזור לעמוד הבית או לראות את הפרויקטים.
          </p>
          <div className='mt-3 flex flex-wrap justify-center gap-3'>
            <ButtonLink to='/' variant='primary' arrow>
              לעמוד הבית
            </ButtonLink>
            <ButtonLink to='/projects' variant='secondary'>
              לפרויקטים
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
