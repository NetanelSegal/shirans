import { Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import Loader from '../../components/Loader/Loader';

const AdminLayout = lazy(() => import('../../components/Admin/AdminLayout'));

export default function Dashboard() {
  return (
    <>
      <Helmet>
        <title>ניהול מערכת - שירן גלעד</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 px-page-all py-section-all" dir="rtl">
        <Suspense fallback={<Loader />}>
          <AdminLayout>
            <Outlet />
          </AdminLayout>
        </Suspense>
      </div>
    </>
  );
}
