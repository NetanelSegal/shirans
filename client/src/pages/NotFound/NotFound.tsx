import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { BASE_URL } from '@/constants/urls';

export default function NotFound() {
    return (
        <>
            <Helmet>
                <title>404 - דף לא נמצא | שירן גלעד אדריכלות ועיצוב פנים</title>
                <meta name="description" content="הדף שביקשת לא נמצא. חזור לעמוד הבית או עיין בפרויקטים שלנו." />
                <meta property="og:title" content="404 - דף לא נמצא | שירן גלעד אדריכלות ועיצוב פנים" />
                <meta property="og:description" content="הדף שביקשת לא נמצא. חזור לעמוד הבית או עיין בפרויקטים שלנו." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`${BASE_URL}/404`} />
                <meta property="og:image" content={`${BASE_URL}/assets/shiranImage-28AXxNS6.jpeg`} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="404 - דף לא נמצא | שירן גלעד אדריכלות ועיצוב פנים" />
                <meta name="twitter:description" content="הדף שביקשת לא נמצא. חזור לעמוד הבית או עיין בפרויקטים שלנו." />
                <meta name="twitter:image" content={`${BASE_URL}/assets/shiranImage-28AXxNS6.jpeg`} />
            </Helmet>
            <div className='flex min-h-[60vh] flex-col items-center justify-center py-20 text-center'>
                <h1 className='heading mb-4 font-bold'>404</h1>
                <p className='paragraph mb-8'>הדף שביקשת לא נמצא</p>
                <Link to='/' className='bg-secondary text-black'>
                    חזור לעמוד הבית
                </Link>
            </div>
        </>
    );
}
