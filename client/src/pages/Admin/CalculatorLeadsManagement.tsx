import { useState } from 'react';
import { useAdminCalculatorLeads } from '@/hooks/admin/useAdminCalculatorLeads';
import { AdminPageHeader } from '@/components/Admin/AdminPageHeader';
import { DataTable } from '@/components/Admin/DataTable';
import { ConfirmDialog } from '@/components/Admin/ConfirmDialog';
import { BulkActionBar } from '@/components/Admin/BulkActionBar';
import { StatusBadge } from '@/components/Admin/StatusBadge';
import { DataStateGuard } from '@/components/DataState';
import Button from '@/components/ui/Button';
import type { CalculatorLeadResponse } from '@shirans/shared';
import { formatPrice, getLeadDisplayEstimate } from '@shirans/shared';

type FilterTab = 'all' | 'unread' | 'read';

export default function CalculatorLeadsManagement() {
  const {
    leads,
    isLoading,
    error,
    actionError,
    clearActionError,
    updateReadStatus,
    delete: deleteLead,
    updateReadStatusBulk,
    deleteBulk,
    refresh,
  } = useAdminCalculatorLeads();

  const [filter, setFilter] = useState<FilterTab>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<CalculatorLeadResponse | null>(
    null
  );
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[] | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkBusy, setIsBulkBusy] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteLead(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!bulkDeleteIds?.length) return;
    setIsBulkBusy(true);
    try {
      await deleteBulk(bulkDeleteIds);
      setBulkDeleteIds(null);
      setSelectedIds([]);
    } catch {
      setBulkDeleteIds(null);
      setSelectedIds([]);
    } finally {
      setIsBulkBusy(false);
    }
  };

  const handleBulkMarkRead = async () => {
    if (!selectedIds.length) return;
    setIsBulkBusy(true);
    try {
      await updateReadStatusBulk(selectedIds, true);
      setSelectedIds([]);
    } catch {
      setSelectedIds([]);
    } finally {
      setIsBulkBusy(false);
    }
  };

  const handleBulkMarkUnread = async () => {
    if (!selectedIds.length) return;
    setIsBulkBusy(true);
    try {
      await updateReadStatusBulk(selectedIds, false);
      setSelectedIds([]);
    } catch {
      setSelectedIds([]);
    } finally {
      setIsBulkBusy(false);
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
          className="text-primary underline hover-capable:hover:text-primary/80"
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
          className="text-primary underline hover-capable:hover:text-primary/80"
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
        `₪ ${formatPrice(getLeadDisplayEstimate(row))}`,
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
      {actionError && (
        <div
          className="mb-4 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800"
          role="alert"
        >
          <span>{actionError}</span>
          <button
            type="button"
            onClick={clearActionError}
            className="rounded px-2 py-1 text-sm font-medium hover:bg-amber-100"
            aria-label="סגור"
          >
            ✕
          </button>
        </div>
      )}
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
              <BulkActionBar
                selectedCount={selectedIds.length}
                onMarkRead={handleBulkMarkRead}
                onMarkUnread={handleBulkMarkUnread}
                onDelete={() => setBulkDeleteIds(selectedIds)}
                onClearSelection={() => setSelectedIds([])}
                mode="leads"
                isBusy={isBulkBusy}
              />
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
                selectable
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                actions={(row) => (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateReadStatus(row.id, !row.isRead)
                      }
                      className="rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-primary transition-colors hover-capable:hover:bg-secondary/80"
                      aria-label={row.isRead ? 'סמן כלא נקרא' : 'סמן כנקרא'}
                    >
                      {row.isRead ? 'לא נקרא' : 'נקרא'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(row)}
                      className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover-capable:hover:bg-red-600"
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
      <ConfirmDialog
        open={!!bulkDeleteIds?.length}
        onClose={() => setBulkDeleteIds(null)}
        onConfirm={handleBulkDelete}
        title="מחיקת לידים"
        message={
          bulkDeleteIds?.length
            ? `האם אתה בטוח שברצונך למחוק ${bulkDeleteIds.length} לידים?`
            : ''
        }
        confirmLabel="מחק"
        isLoading={isBulkBusy}
      />
    </div>
  );
}
