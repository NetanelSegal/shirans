import { ReactNode } from 'react';
import { SortableHeaderCell } from './SortableHeaderCell';
import type { ColumnConfig, SortState } from './types';

interface DesktopTableProps<T> {
  columns: ColumnConfig<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  actions?: (row: T) => ReactNode;
  actionsHeader: string;
  selectable: boolean;
  selectedIds: string[];
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  sortStateByKey: Map<string, SortState>;
}

export function DesktopTable<T>({
  columns,
  rows,
  getRowId,
  actions,
  actionsHeader,
  selectable,
  selectedIds,
  onToggleRow,
  onToggleAll,
  sortStateByKey,
}: DesktopTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200" role="table">
        <thead className="bg-gray-50">
          <tr>
            {selectable && (
              <th scope="col" className="px-4 py-4 text-right">
                <label className="flex items-center justify-end gap-2">
                  <input
                    type="checkbox"
                    checked={
                      rows.length > 0 &&
                      rows.every((row) => selectedIds.includes(getRowId(row)))
                    }
                    onChange={onToggleAll}
                    aria-label="בחר הכל"
                    className="h-4 w-4 rounded"
                  />
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    בחר
                  </span>
                </label>
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500 ${col.className ?? ''}`}
              >
                <SortableHeaderCell label={col.header} sortState={sortStateByKey.get(col.key)} />
              </th>
            ))}
            {actions && (
              <th
                scope="col"
                className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {actionsHeader}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {rows.map((row) => {
            const rowId = getRowId(row);
            return (
              <tr key={rowId} className="hover:bg-gray-50">
                {selectable && (
                  <td className="whitespace-nowrap px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(rowId)}
                      onChange={() => onToggleRow(rowId)}
                      aria-label={`בחר שורה ${rowId}`}
                      className="h-4 w-4 rounded"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`whitespace-nowrap px-6 py-4 text-sm text-gray-900 ${col.className ?? ''}`}
                  >
                    {col.render(row)}
                  </td>
                ))}
                {actions && (
                  <td className="whitespace-nowrap px-6 py-4 text-sm">{actions(row)}</td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
