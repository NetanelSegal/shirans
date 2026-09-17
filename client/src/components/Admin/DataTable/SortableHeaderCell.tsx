import type { SortState } from './types';

interface SortableHeaderCellProps {
  label: string;
  sortState?: SortState;
}

export function SortableHeaderCell({ label, sortState }: SortableHeaderCellProps) {
  if (!sortState?.canSort) {
    return <>{label}</>;
  }

  return (
    <button
      type="button"
      onClick={sortState.toggle}
      className="flex items-center gap-1 hover:text-gray-800"
    >
      {label}
      <i
        aria-hidden
        className={`fa-solid ${
          sortState.isSorted === 'asc'
            ? 'fa-sort-up'
            : sortState.isSorted === 'desc'
              ? 'fa-sort-down'
              : 'fa-sort text-gray-300'
        }`}
      />
    </button>
  );
}
