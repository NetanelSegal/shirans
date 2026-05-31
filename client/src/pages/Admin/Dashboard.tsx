import { Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import PageSeo from '@/components/Seo/PageSeo';
import Loader from '../../components/Loader/Loader';

const AdminLayout = lazy(() => import('../../components/Admin/AdminLayout'));

export default function Dashboard() {
  return (
    <>
      <PageSeo
        title="ניהול מערכת - שירן גלעד"
        description="אזור ניהול מערכת"
        path="/admin"
        noIndex
      />
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <Suspense fallback={<Loader />}>
          <AdminLayout>
            <Outlet />
          </AdminLayout>
        </Suspense>
      </div>
    </>
  );
}
