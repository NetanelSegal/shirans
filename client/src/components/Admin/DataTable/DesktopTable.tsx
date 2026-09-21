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
    <div className="overflow-x-auto rounded-card border border-line/70 bg-surface-raised shadow-card">
      <table className="min-w-full divide-y divide-line/70" role="table">
        <thead className="bg-surface-soft">
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
                    className="h-4 w-4 rounded-field"
                  />
                  <span className="text-xs font-medium uppercase tracking-wider text-ink-subtle">
                    בחר
                  </span>
                </label>
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-ink-subtle ${col.className ?? ''}`}
              >
                <SortableHeaderCell label={col.header} sortState={sortStateByKey.get(col.key)} />
              </th>
            ))}
            {actions && (
              <th
                scope="col"
                className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-ink-subtle"
              >
                {actionsHeader}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-line/70 bg-surface-raised">
          {rows.map((row) => {
            const rowId = getRowId(row);
            return (
              <tr key={rowId} className="hover:bg-surface-soft">
                {selectable && (
                  <td className="whitespace-nowrap px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(rowId)}
                      onChange={() => onToggleRow(rowId)}
                      aria-label={`בחר שורה ${rowId}`}
                      className="h-4 w-4 rounded-field"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`whitespace-nowrap px-6 py-4 text-sm text-ink ${col.className ?? ''}`}
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
