import { useState } from 'react';
import { useAdminContacts } from '@/hooks/admin/useAdminContacts';
import { AdminPageHeader } from '@/components/Admin/AdminPageHeader';
import { DataTable } from '@/components/Admin/DataTable';
import { ConfirmDialog } from '@/components/Admin/ConfirmDialog';
import { StatusBadge } from '@/components/Admin/StatusBadge';
import { DataStateGuard } from '@/components/DataState';
import Button from '@/components/ui/Button';
import type { ContactResponse } from '@shirans/shared';

type FilterTab = 'all' | 'unread' | 'read';

export default function ContactsManagement() {
  const {
    contacts,
    isLoading,
    error,
    updateReadStatus,
    delete: deleteContact,
    refresh,
  } = useAdminContacts();

  const [filter, setFilter] = useState<FilterTab>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactResponse | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteContact(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

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

  const columns = [
    {
      key: 'name',
      header: 'שם',
      render: (row: ContactResponse) => row.name,
    },
    {
      key: 'email',
      header: 'אימייל',
      render: (row: ContactResponse) => row.email,
    },
    {
      key: 'phoneNumber',
      header: 'טלפון',
      render: (row: ContactResponse) => row.phoneNumber,
    },
    {
      key: 'message',
      header: 'הודעה',
      render: (row: ContactResponse) =>
        expandedId === row.id ? (
          <span className="block max-w-[320px] whitespace-normal">
            {row.message ?? ''}
          </span>
        ) : (
          <span
            className="block max-w-[280px] truncate"
            title={row.message ?? ''}
          >
            {row.message ?? ''}
          </span>
        ),
      className: 'max-w-[320px] whitespace-normal',
    },
    {
      key: 'isRead',
      header: 'סטטוס',
      render: (row: ContactResponse) => (
        <StatusBadge
          label={row.isRead ? 'נקרא' : 'לא נקרא'}
          variant={row.isRead ? 'read' : 'unread'}
        />
      ),
    },
    {
      key: 'createdAt',
      header: 'תאריך',
      render: (row: ContactResponse) => formatDate(row.createdAt),
    },
  ];

  return (
    <div dir="rtl">
      <DataStateGuard
        data={contacts}
        isLoading={isLoading}
        error={error}
        emptyMessage="אין פניות"
        onRetry={refresh}
        loadingMinHeight="20rem"
      >
        {(data) => {
          const filtered =
            filter === 'all'
              ? data
              : filter === 'unread'
                ? data.filter((c) => !c.isRead)
                : data.filter((c) => c.isRead);
          return (
            <>
              <AdminPageHeader title="ניהול פניות צור קשר" />
              <div className="mb-4 flex gap-2">
                <Button
                  variant={filter === 'all' ? 'primary' : 'light'}
                  onClick={() => setFilter('all')}
                >
                  הכל
                </Button>
                <Button
                  variant={filter === 'unread' ? 'primary' : 'light'}
                  onClick={() => setFilter('unread')}
                >
                  שלא נקראו
                </Button>
                <Button
                  variant={filter === 'read' ? 'primary' : 'light'}
                  onClick={() => setFilter('read')}
                >
                  נקראו
                </Button>
              </div>
              <DataTable
                columns={columns}
                data={filtered}
                isLoading={false}
                emptyMessage="אין פניות"
                getRowId={(row) => row.id}
                actions={(row) => (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(expandedId === row.id ? null : row.id)
                      }
                      className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                      aria-label={expandedId === row.id ? 'צמצם' : 'הרחב'}
                    >
                      {expandedId === row.id ? 'צמצם' : 'הצג'}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateReadStatus(row.id, !row.isRead)
                      }
                      className="rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-secondary/80"
                      aria-label={row.isRead ? 'סמן כלא נקרא' : 'סמן כנקרא'}
                    >
                      {row.isRead ? 'לא נקרא' : 'נקרא'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(row)}
                      className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
                      aria-label={`מחק פנייה מ${row.name}`}
                    >
                      מחיקה
                    </button>
                  </div>
                )}
              />
            </>
          );
        }}
      </DataStateGuard>
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="מחיקת פנייה"
        message={
          deleteTarget
            ? `האם אתה בטוח שברצונך למחוק את הפנייה מ"${deleteTarget.name}"?`
            : ''
        }
        confirmLabel="מחק"
        isLoading={isDeleting}
      />
    </div>
  );
}
