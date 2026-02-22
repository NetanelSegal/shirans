import { useAdminUsers } from '@/hooks/admin/useAdminUsers';
import { AdminPageHeader } from '@/components/Admin/AdminPageHeader';
import { DataTable } from '@/components/Admin/DataTable';
import { DataStateGuard } from '@/components/DataState';
import type { UserResponse } from '@shirans/shared';

export default function UsersManagement() {
  const { users, isLoading, error, refresh } = useAdminUsers();

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('he-IL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatRole = (role: UserResponse['role']) =>
    role === 'ADMIN' ? 'מנהל' : 'משתמש';

  const columns = [
    {
      key: 'name',
      header: 'שם',
      render: (row: UserResponse) => row.name,
    },
    {
      key: 'email',
      header: 'אימייל',
      render: (row: UserResponse) => row.email,
    },
    {
      key: 'role',
      header: 'תפקיד',
      render: (row: UserResponse) => formatRole(row.role),
    },
    {
      key: 'createdAt',
      header: 'תאריך הצטרפות',
      render: (row: UserResponse) => formatDate(row.createdAt),
    },
  ];

  return (
    <div dir="rtl">
      <DataStateGuard
        data={users}
        isLoading={isLoading}
        error={error}
        emptyMessage="אין משתמשים"
        onRetry={refresh}
        loadingMinHeight="20rem"
      >
        {(data) => (
          <>
            <AdminPageHeader title="ניהול משתמשים" />
            <DataTable
              columns={columns}
              data={data}
              isLoading={false}
              emptyMessage="אין משתמשים"
              getRowId={(row) => row.id}
            />
          </>
        )}
      </DataStateGuard>
    </div>
  );
}
