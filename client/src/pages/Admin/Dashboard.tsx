import { Outlet } from 'react-router-dom';
import PageSeo from '@/components/Seo/PageSeo';
import AdminLayout from '../../components/Admin/AdminLayout';

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
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      </div>
    </>
  );
}
