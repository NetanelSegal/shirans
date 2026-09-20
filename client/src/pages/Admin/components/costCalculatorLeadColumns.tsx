import { REGION_LABELS, formatShekels } from '@shirans/shared';
import type { CostCalculatorLeadResponse } from '@shirans/shared';
import { StatusBadge } from '@/components/Admin/StatusBadge';
import type { ColumnConfig } from '@/components/Admin/DataTable/types';

function formatDate(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleDateString('he-IL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
}

export const costCalculatorLeadColumns: ColumnConfig<CostCalculatorLeadResponse>[] = [
  {
    key: 'name',
    header: 'שם',
    render: (row) => row.name,
    sortValue: (row) => row.name,
    searchValue: (row) => row.name,
  },
  {
    key: 'email',
    header: 'אימייל',
    render: (row) => (
      <a
        href={`mailto:${row.email}`}
        className="text-primary underline hover-capable:hover:text-primary/80"
        aria-label={`שלח מייל ל${row.email}`}
      >
        {row.email}
      </a>
    ),
    searchValue: (row) => row.email,
  },
  {
    key: 'phoneNumber',
    header: 'טלפון',
    render: (row) => (
      <a
        href={`tel:${row.phoneNumber}`}
        className="text-primary underline hover-capable:hover:text-primary/80"
        aria-label={`התקשר ל${row.phoneNumber}`}
      >
        {row.phoneNumber}
      </a>
    ),
    searchValue: (row) => row.phoneNumber,
  },
  {
    key: 'region',
    header: 'אזור',
    render: (row) => REGION_LABELS[row.region],
    sortValue: (row) => REGION_LABELS[row.region],
  },
  {
    key: 'builtAreaSqm',
    header: 'שטח',
    render: (row) => `${row.builtAreaSqm} מ״ר`,
    sortValue: (row) => row.builtAreaSqm,
  },
  {
    key: 'estimate',
    header: 'אומדן',
    // Each amount is its own element so bidi can't move the dash to the wrong
    // end of an RTL cell.
    render: (row) => (
      <span className="flex flex-wrap items-center gap-x-1.5 whitespace-nowrap">
        <span>{formatShekels(row.estimateMin)} ₪</span>
        <span aria-hidden>–</span>
        <span>{formatShekels(row.estimateMax)} ₪</span>
      </span>
    ),
    sortValue: (row) => row.estimateMin,
  },
  {
    key: 'isRead',
    header: 'סטטוס',
    render: (row) => (
      <StatusBadge
        label={row.isRead ? 'נקרא' : 'לא נקרא'}
        variant={row.isRead ? 'read' : 'unread'}
      />
    ),
    sortValue: (row) => (row.isRead ? 1 : 0),
  },
  {
    key: 'createdAt',
    header: 'תאריך',
    render: (row) => formatDate(row.createdAt),
    sortValue: (row) => new Date(row.createdAt),
  },
];
