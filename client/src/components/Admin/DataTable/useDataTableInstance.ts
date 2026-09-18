import { useMemo } from 'react';
import { useTable } from '@tanstack/react-table';
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowSortingFeature,
  tableFeatures,
  type RowData,
} from '@tanstack/table-core';
import type { ColumnConfig, SortState } from './types';

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
});

/**
 * Wraps TanStack Table v9 (`useTable`) with the shape `DataTable` needs:
 * plain rows (already sorted/filtered), plus per-column sort state for headers.
 */
export function useDataTableInstance<T extends RowData>(
  columns: ColumnConfig<T>[],
  data: T[],
) {
  const columnHelper = useMemo(() => createColumnHelper<typeof features, T>(), []);

  const tableColumns = useMemo(
    () =>
      columns.map((col) =>
        columnHelper.accessor(
          (row: T): unknown => col.sortValue?.(row) ?? col.searchValue?.(row) ?? '',
          {
            id: col.key,
            header: col.header,
            enableSorting: !!col.sortValue,
            enableGlobalFilter: !!col.searchValue,
          },
        ),
      ),
    [columns, columnHelper],
  );

  const table = useTable(
    {
      features,
      columns: tableColumns,
      data,
      globalFilterFn: 'includesString',
    },
    (state) => ({ sorting: state.sorting, globalFilter: state.globalFilter }),
  );

  const rows = table.getRowModel().rows.map((r) => r.original);

  const sortStateByKey = new Map<string, SortState>(
    (table.getHeaderGroups()[0]?.headers ?? []).map((h) => [
      h.column.id,
      {
        canSort: h.column.getCanSort(),
        isSorted: h.column.getIsSorted(),
        toggle: h.column.getToggleSortingHandler(),
      },
    ]),
  );

  return {
    rows,
    sortStateByKey,
    globalFilter: table.state.globalFilter ?? '',
    setGlobalFilter: (value: string) => table.setGlobalFilter(value),
  };
}
