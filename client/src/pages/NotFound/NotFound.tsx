import { Link, useLocation } from 'react-router-dom';
import PageSeo from '@/components/Seo/PageSeo';
import Button from '@/components/ui/Button';

const NOT_FOUND_TITLE = '404 - דף לא נמצא | שירן גלעד אדריכלות ועיצוב פנים';
const NOT_FOUND_DESCRIPTION =
  'הדף שביקשת לא נמצא. חזור לעמוד הבית או עיין בפרויקטים שלנו.';

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
      <div className='flex min-h-[60vh] flex-col items-center justify-center py-20 text-center'>
        <h1 className='heading mb-4 font-bold'>404</h1>
        <p className='paragraph mb-8'>הדף שביקשת לא נמצא</p>
        <Button variant='secondary'>
          <Link to='/'>חזור לעמוד הבית</Link>
        </Button>
      </div>
    </>
  );
}
