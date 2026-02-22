import { useState } from 'react';
import { useAdminContacts } from '@/hooks/admin/useAdminContacts';
import { AdminPageHeader } from '@/components/Admin/AdminPageHeader';
import { DataTable } from '@/components/Admin/DataTable';
import { ConfirmDialog } from '@/components/Admin/ConfirmDialog';
import { StatusBadge } from '@/components/Admin/StatusBadge';
import { ErrorState } from '@/components/DataState';
import Button from '@/components/ui/Button';
import type { ContactResponse } from '@shirans/shared';

const truncate = (str: string, len: number) =>
  str.length <= len ? str : `${str.slice(0, len)}...`;

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

  const filteredContacts =
    filter === 'all'
      ? contacts
      : filter === 'unread'
        ? contacts.filter((c) => !c.isRead)
        : contacts.filter((c) => c.isRead);

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
        expandedId === row.id
          ? row.message ?? ''
          : truncate(row.message ?? '', 40),
      className: 'max-w-[200px]',
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

  if (error) {
    return (
      <div className="p-6" dir="rtl">
        <ErrorState message={error} onRetry={refresh} />
      </div>
    );
  }

  return (
    <div className="p-6" dir="rtl">
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
        data={filteredContacts}
        isLoading={isLoading}
        emptyMessage="אין פניות"
        getRowId={(row) => row.id}
        actions={(row) => (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setExpandedId(expandedId === row.id ? null : row.id)
              }
              className="text-primary hover:underline"
              aria-label={expandedId === row.id ? 'צמצם' : 'הרחב'}
            >
              {expandedId === row.id ? 'צמצם' : 'הצג'}
            </button>
            <button
              type="button"
              onClick={() =>
                updateReadStatus(row.id, !row.isRead)
              }
              className="text-primary hover:underline"
              aria-label={row.isRead ? 'סמן כלא נקרא' : 'סמן כנקרא'}
            >
              {row.isRead ? 'לא נקרא' : 'נקרא'}
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget(row)}
              className="text-red-600 hover:underline"
              aria-label={`מחק פנייה מ${row.name}`}
            >
              מחיקה
            </button>
          </div>
        )}
      />
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
