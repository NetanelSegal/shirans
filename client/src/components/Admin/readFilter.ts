export type ReadFilter = 'all' | 'unread' | 'read';

export const READ_FILTER_TABS: { value: ReadFilter; label: string }[] = [
  { value: 'all', label: 'הכל' },
  { value: 'unread', label: 'שלא נקראו' },
  { value: 'read', label: 'נקראו' },
];

export function filterByRead<T extends { isRead: boolean }>(
  rows: T[],
  filter: ReadFilter,
): T[] {
  if (filter === 'unread') return rows.filter((row) => !row.isRead);
  if (filter === 'read') return rows.filter((row) => row.isRead);
  return rows;
}
