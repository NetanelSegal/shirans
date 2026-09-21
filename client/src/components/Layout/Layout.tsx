import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import PageLoader from '@/components/Loader/PageLoader';
import { ContactBand } from '@/components/Contact/ContactBand';
import { PreviewBanner } from '@/components/PreviewBanner';
import { hasPhotoHero } from '@/constants/navigation';
import { cn } from '@/lib/cn';

/** Pages that end without the contact band: they have their own form or are a funnel. */
const NO_CONTACT_BAND_PATHS = ['/contact', '/calculator', '/calculator/result', '/login', '/register'];
const NO_FOOTER_PATHS = ['/login', '/register', '/calculator'];

export default function Layout() {
  const { pathname } = useLocation();
  const path = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  const overPhoto = hasPhotoHero(path);

  return (
    <>
      <PreviewBanner />
      <Navbar overPhoto={overPhoto} />
      <main className={cn('min-h-[60svh] overflow-x-clip', !overPhoto && 'pt-nav')}>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      {!NO_CONTACT_BAND_PATHS.includes(path) && <ContactBand path={path} />}
      {!NO_FOOTER_PATHS.includes(path) && <Footer />}
    </>
  );
}
