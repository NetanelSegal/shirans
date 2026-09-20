import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { CostCalculatorLeadResponse } from '@shirans/shared';
import { useAdminCalculatorLeads } from '@/hooks/admin/useAdminCalculatorLeads';
import { AdminPageHeader } from '@/components/Admin/AdminPageHeader';
import { BulkActionBar } from '@/components/Admin/BulkActionBar';
import { ConfirmDialog } from '@/components/Admin/ConfirmDialog';
import { DataTable } from '@/components/Admin/DataTable';
import { ReadFilterTabs } from '@/components/Admin/ReadFilterTabs';
import { filterByRead, type ReadFilter } from '@/components/Admin/readFilter';
import { ErrorState, LoadingState } from '@/components/DataState';
import { CostCalculatorLeadDetails } from './components/CostCalculatorLeadDetails';
import { costCalculatorLeadColumns } from './components/costCalculatorLeadColumns';
import { LEAD_QUERY_PARAM } from '@/utils/adminLeadUrl';

const NO_LEADS_AT_ALL = 'עדיין לא התקבלו לידים מהמחשבון.';

const NO_MATCHES: Record<ReadFilter, string> = {
  all: NO_LEADS_AT_ALL,
  unread: 'כל הלידים סומנו כנקראו.',
  read: 'אף ליד עדיין לא סומן כנקרא.',
};

/** "All leads are read" is a lie when there are no leads to read. */
function emptyMessage(filter: ReadFilter, totalLeads: number): string {
  return totalLeads === 0 ? NO_LEADS_AT_ALL : NO_MATCHES[filter];
}

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
    isMutationPending,
  } = useAdminCalculatorLeads();

  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<ReadFilter>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detailsTarget, setDetailsTarget] =
    useState<CostCalculatorLeadResponse | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<CostCalculatorLeadResponse | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[] | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  /**
   * A message sent from the result page links straight here with `?lead=<id>`.
   * The lead can only be opened once the list has arrived, and the parameter is
   * dropped as soon as it has been used so a refresh doesn't reopen the dialog
   * the reader just closed.
   */
  const requestedLeadId = searchParams.get(LEAD_QUERY_PARAM);
  useEffect(() => {
    if (!requestedLeadId) return;
    const match = leads.find((lead) => lead.id === requestedLeadId);
    if (!match) return;

    setDetailsTarget(match);
    setSearchParams(
      (params) => {
        params.delete(LEAD_QUERY_PARAM);
        return params;
      },
      { replace: true },
    );
  }, [requestedLeadId, leads, setSearchParams]);

  /** Every action here is optimistic about nothing: it clears its own dialog either way. */
  const run = async (action: () => Promise<unknown>, done: () => void) => {
    setIsBusy(true);
    try {
      await action();
    } catch {
      // Surfaced through actionError by the hook.
    } finally {
      done();
      setIsBusy(false);
    }
  };

  const visible = filterByRead(leads, filter);

  /**
   * Only ever act on rows that are on screen. The selection used to survive a
   * tab change and a search, so six ticked rows could scroll out of sight and
   * still be deleted by a bar that was counting them.
   */
  const visibleIds = new Set(visible.map((lead) => lead.id));
  const actionableIds = selectedIds.filter((id) => visibleIds.has(id));

  const changeFilter = (next: ReadFilter) => {
    setFilter(next);
    setSelectedIds([]);
  };
  const counts = {
    all: leads.length,
    unread: leads.filter((lead) => !lead.isRead).length,
    read: leads.filter((lead) => lead.isRead).length,
  };

  return (
    <div dir="rtl">
      {/* The header and the tabs render whatever the data does. Wrapping them in
          a data guard meant that with no leads the whole screen collapsed to a
          single centred "אין לידים" — no title, no filters, nothing to say the
          page had loaded at all. */}
      <AdminPageHeader title="לידים מהמחשבון" />

      {actionError && (
        <div
          className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900"
          role="alert"
        >
          <span>{actionError}</span>
          <button
            type="button"
            onClick={clearActionError}
            className="rounded bg-transparent px-2 py-1 text-sm font-medium text-amber-900 hover-capable:hover:scale-100 hover-capable:hover:bg-amber-100"
            aria-label="סגירת ההודעה"
          >
            ✕
          </button>
        </div>
      )}

      <BulkActionBar
        selectedCount={actionableIds.length}
        onMarkRead={() =>
          run(() => updateReadStatusBulk(actionableIds, true), () => setSelectedIds([]))
        }
        onMarkUnread={() =>
          run(() => updateReadStatusBulk(actionableIds, false), () => setSelectedIds([]))
        }
        onDelete={() => setBulkDeleteIds(actionableIds)}
        onClearSelection={() => setSelectedIds([])}
        mode="leads"
        isBusy={isBusy}
      />

      <ReadFilterTabs value={filter} onChange={changeFilter} counts={counts} />

      {/* A link that named a lead the list doesn't contain — deleted, or a bad
          id — says so rather than silently doing nothing. */}
      {requestedLeadId &&
        !isLoading &&
        !leads.some((lead) => lead.id === requestedLeadId) && (
          <p
            className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900"
            role="status"
          >
            הפנייה שהקישור הוביל אליה לא נמצאה — ייתכן שהיא נמחקה.
          </p>
        )}

      {error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : isLoading ? (
        <LoadingState minHeight="20rem" />
      ) : (
        <DataTable
          columns={costCalculatorLeadColumns}
          data={visible}
          emptyMessage={emptyMessage(filter, leads.length)}
          getRowId={(row) => row.id}
          searchPlaceholder="חיפוש לפי שם, אימייל או טלפון"
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          actions={(row) => (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setDetailsTarget(row)}
                className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover-capable:hover:scale-100 hover-capable:hover:bg-primary/90"
                aria-label={`צפייה בתשובות של ${row.name}`}
              >
                פרטים
              </button>
              <button
                type="button"
                disabled={isMutationPending}
                onClick={() => {
                  void updateReadStatus(row.id, !row.isRead).catch(() => {});
                }}
                className="rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-primary transition-colors hover-capable:hover:scale-100 hover-capable:hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={row.isRead ? 'סימון כלא נקרא' : 'סימון כנקרא'}
              >
                {row.isRead ? 'לא נקרא' : 'נקרא'}
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(row)}
                className="rounded-lg bg-red-700 px-3 py-1.5 text-sm font-medium text-white transition-colors hover-capable:hover:scale-100 hover-capable:hover:bg-red-800"
                aria-label={`מחיקת הליד של ${row.name}`}
              >
                מחיקה
              </button>
            </div>
          )}
        />
      )}

      <CostCalculatorLeadDetails
        lead={detailsTarget}
        onClose={() => setDetailsTarget(null)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            void run(() => deleteLead(deleteTarget.id), () => setDeleteTarget(null));
          }
        }}
        title="מחיקת ליד"
        message={
          deleteTarget
            ? `למחוק את הליד של "${deleteTarget.name}"? הפעולה אינה הפיכה.`
            : ''
        }
        confirmLabel="מחיקה"
        isLoading={isBusy}
      />

      <ConfirmDialog
        open={!!bulkDeleteIds?.length}
        onClose={() => setBulkDeleteIds(null)}
        onConfirm={() => {
          if (bulkDeleteIds) {
            void run(() => deleteBulk(bulkDeleteIds), () => {
              setBulkDeleteIds(null);
              setSelectedIds([]);
            });
          }
        }}
        title="מחיקת לידים"
        message={
          bulkDeleteIds?.length
            ? `למחוק ${bulkDeleteIds.length} לידים? הפעולה אינה הפיכה.`
            : ''
        }
        confirmLabel="מחיקה"
        isLoading={isBusy}
      />
    </div>
  );
}
