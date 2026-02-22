import { useState } from 'react';
import { useAdminCalculatorLeads } from '@/hooks/admin/useAdminCalculatorLeads';
import { AdminPageHeader } from '@/components/Admin/AdminPageHeader';
import { DataTable } from '@/components/Admin/DataTable';
import { ConfirmDialog } from '@/components/Admin/ConfirmDialog';
import { StatusBadge } from '@/components/Admin/StatusBadge';
import { DataStateGuard } from '@/components/DataState';
import Button from '@/components/ui/Button';
import type { CalculatorLeadResponse } from '@shirans/shared';
import { formatPrice } from '@shirans/shared';

type FilterTab = 'all' | 'unread' | 'read';

export default function CalculatorLeadsManagement() {
  const {
    leads,
    isLoading,
    error,
    updateReadStatus,
    delete: deleteLead,
    refresh,
  } = useAdminCalculatorLeads();

  const [filter, setFilter] = useState<FilterTab>('all');
  const [deleteTarget, setDeleteTarget] = useState<CalculatorLeadResponse | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteLead(deleteTarget.id);
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
      render: (row: CalculatorLeadResponse) => row.name,
    },
    {
      key: 'email',
      header: 'אימייל',
      render: (row: CalculatorLeadResponse) => (
        <a
          href={`mailto:${row.email}`}
          className="text-primary underline hover:text-primary/80"
          aria-label={`שלח מייל ל${row.email}`}
        >
          {row.email}
        </a>
      ),
    },
    {
      key: 'phoneNumber',
      header: 'טלפון',
      render: (row: CalculatorLeadResponse) => (
        <a
          href={`tel:${row.phoneNumber}`}
          className="text-primary underline hover:text-primary/80"
          aria-label={`התקשר ל${row.phoneNumber}`}
        >
          {row.phoneNumber}
        </a>
      ),
    },
    {
      key: 'estimate',
      header: 'אומדן',
      render: (row: CalculatorLeadResponse) =>
        `₪ ${formatPrice(row.estimateMin)} – ₪ ${formatPrice(row.estimateMax)}`,
    },
    {
      key: 'isRead',
      header: 'סטטוס',
      render: (row: CalculatorLeadResponse) => (
        <StatusBadge
          label={row.isRead ? 'נקרא' : 'לא נקרא'}
          variant={row.isRead ? 'read' : 'unread'}
        />
      ),
    },
    {
      key: 'createdAt',
      header: 'תאריך',
      render: (row: CalculatorLeadResponse) => formatDate(row.createdAt),
    },
  ];

  return (
    <div dir="rtl">
      <DataStateGuard
        data={leads}
        isLoading={isLoading}
        error={error}
        emptyMessage="אין לידים"
        onRetry={refresh}
        loadingMinHeight="20rem"
      >
        {(data) => {
          const filtered =
            filter === 'all'
              ? data
              : filter === 'unread'
                ? data.filter((l) => !l.isRead)
                : data.filter((l) => l.isRead);
          return (
            <>
              <AdminPageHeader title="לידים ממחשבון אומדן" />
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
                emptyMessage="אין לידים"
                getRowId={(row) => row.id}
                actions={(row) => (
                  <div className="flex flex-wrap gap-2">
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
                      aria-label={`מחק ליד מ${row.name}`}
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
        title="מחיקת ליד"
        message={
          deleteTarget
            ? `האם אתה בטוח שברצונך למחוק את הליד מ"${deleteTarget.name}"?`
            : ''
        }
        confirmLabel="מחק"
        isLoading={isDeleting}
      />
    </div>
  );
}
