import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { Suspense } from 'react';
import PageLoader from '@/components/Loader/PageLoader';

const HIDE_FOOTER_PATHS = ['/login', '/register', '/calculator', '/contact'];

export default function Layout() {
  const { pathname } = useLocation();
  const showFooter = !HIDE_FOOTER_PATHS.includes(pathname);

  return (
    <>
      <Navbar />
      <div className='px-page-all overflow-hidden'>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </div>
      {showFooter && <Footer />}
    </>
  );
}
