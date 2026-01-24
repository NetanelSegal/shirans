import { usePageMetadata } from '@/hooks/usePageMetadata';
import { Link } from 'react-router-dom';

export default function NotFound() {
  usePageMetadata({
    title: '404 - דף לא נמצא | שירן גלעד אדריכלות ועיצוב פנים',
    description: 'הדף שביקשת לא נמצא. חזור לעמוד הבית או עיין בפרויקטים שלנו.',
    ogImage: '/assets/shiranImage-28AXxNS6.jpeg',
  });

  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center py-20 text-center'>
      <h1 className='heading mb-4 font-bold'>404</h1>
      <p className='paragraph mb-8'>הדף שביקשת לא נמצא</p>
      <Link to='/' className='bg-secondary text-black'>
        חזור לעמוד הבית
      </Link>
    </div>
  );
}
