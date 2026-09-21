import { ReactNode } from 'react';
import type { ColumnConfig } from './types';

interface MobileCardListProps<T> {
  columns: ColumnConfig<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  actions?: (row: T) => ReactNode;
  selectable: boolean;
  selectedIds: string[];
  onToggleRow: (id: string) => void;
}

export function MobileCardList<T>({
  columns,
  rows,
  getRowId,
  actions,
  selectable,
  selectedIds,
  onToggleRow,
}: MobileCardListProps<T>) {
  return (
    <div className="flex flex-col gap-4" role="list">
      {rows.map((row) => {
        const rowId = getRowId(row);
        return (
          <article
            key={rowId}
            className="rounded-card border border-line/70 bg-surface-raised p-4 shadow-card"
            role="listitem"
            aria-label={`פריט ${rowId}`}
          >
            {selectable && (
              <div className="mb-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(rowId)}
                    onChange={() => onToggleRow(rowId)}
                    aria-label={`בחר שורה ${rowId}`}
                    className="h-4 w-4 rounded-field"
                  />
                  <span className="text-sm">בחר</span>
                </label>
              </div>
            )}
            <div className="flex flex-col gap-2">
              {columns.map((col) => (
                <div key={col.key} className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-ink-subtle">
                    {col.header}
                  </span>
                  <div className={`text-sm text-ink ${col.className ?? ''}`}>
                    {col.render(row)}
                  </div>
                </div>
              ))}
            </div>
            {actions && (
              <div className="mt-3 flex flex-wrap gap-2 border-t border-line/50 pt-3">
                {actions(row)}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
