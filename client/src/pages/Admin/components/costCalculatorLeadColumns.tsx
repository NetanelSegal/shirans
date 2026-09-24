import { REGION_LABELS } from '@shirans/shared';
import type { CostCalculatorLeadResponse } from '@shirans/shared';
import { StatusBadge } from '@/components/Admin/StatusBadge';
import { ShekelAmount } from '@/components/ui/ShekelAmount';
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
        className="text-ink underline hover-capable:hover:text-ink-muted"
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
        className="text-ink underline hover-capable:hover:text-ink-muted"
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
    render: (row) => <ShekelAmount value={row.estimate} />,
    sortValue: (row) => row.estimate,
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
