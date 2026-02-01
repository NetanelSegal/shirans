import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { Suspense } from 'react';
import Loader from '@/components/Loader';
export default function Layout() {
  return (
    <>
      <Navbar />
      <div className='px-page-all overflow-hidden'>
        <Suspense
          fallback={
            <div className='flex min-h-screen items-center justify-center'>
              <Loader />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
