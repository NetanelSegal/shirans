import { ReactNode } from 'react';
import Loader from '@/components/Loader/Loader';
import { useScreenContext } from '@/contexts/ScreenProvider';

export interface ColumnConfig<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
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
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'אין נתונים להצגה',
  getRowId,
  actions,
  actionsHeader = 'פעולות',
  selectable = false,
  selectedIds = [],
  onSelectionChange,
}: DataTableProps<T>) {
  const { isSmallScreen } = useScreenContext();

  const toggleRow = (id: string) => {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((x) => x !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const toggleAll = () => {
    if (!onSelectionChange) return;
    const allIds = data.map((row) => getRowId(row));
    const allSelected = allIds.every((id) => selectedIds.includes(id));
    onSelectionChange(allSelected ? [] : allIds);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-gray-200 bg-white p-8">
        <Loader />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-500"
        role="status"
        aria-live="polite"
      >
        {emptyMessage}
      </div>
    );
  }

  if (isSmallScreen) {
    return (
      <div className="flex flex-col gap-4" role="list">
        {data.map((row) => {
          const rowId = getRowId(row);
          return (
            <article
              key={rowId}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              role="listitem"
              aria-label={`פריט ${rowId}`}
            >
              {selectable && (
                <div className="mb-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(rowId)}
                      onChange={() => toggleRow(rowId)}
                      aria-label={`בחר שורה ${rowId}`}
                      className="h-4 w-4 rounded"
                    />
                    <span className="text-sm">בחר</span>
                  </label>
                </div>
              )}
              <div className="flex flex-col gap-2">
                {columns.map((col) => (
                <div key={col.key} className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    {col.header}
                  </span>
                  <div
                    className={`text-sm text-gray-900 ${col.className ?? ''}`}
                  >
                    {col.render(row)}
                  </div>
                </div>
              ))}
            </div>
              {actions && (
                <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                  {actions(row)}
                </div>
              )}
            </article>
          );
        })}
      </div>
    );
  }

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
                      data.length > 0 &&
                      data.every((row) => selectedIds.includes(getRowId(row)))
                    }
                    onChange={toggleAll}
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
                {col.header}
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
          {data.map((row) => {
            const rowId = getRowId(row);
            return (
              <tr key={rowId} className="hover:bg-gray-50">
                {selectable && (
                  <td className="whitespace-nowrap px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(rowId)}
                      onChange={() => toggleRow(rowId)}
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
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {actions(row)}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
