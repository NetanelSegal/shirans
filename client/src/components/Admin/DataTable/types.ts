import { ReactNode } from 'react';

export interface ColumnConfig<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  /** Enables sorting on this column. Must return a comparable primitive. */
  sortValue?: (row: T) => string | number | Date;
  /** Included in the table's global search, if `searchPlaceholder` is set. */
  searchValue?: (row: T) => string;
}

export interface DataTableProps<T> {
  columns: ColumnConfig<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  getRowId: (row: T) => string;
  actions?: (row: T) => ReactNode;
  actionsHeader?: string;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Shows a global search box above the table. Only matches columns with `searchValue`. */
  searchPlaceholder?: string;
}

export interface SortState {
  canSort: boolean;
  isSorted: false | 'asc' | 'desc';
  toggle?: (event: unknown) => void;
}
