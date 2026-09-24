import { LoadingRegion, Skeleton } from '@/components/ui/Skeleton';

interface AdminTableSkeletonProps {
  /** Header cells to draw — match the table's column count so widths line up. */
  columns?: number;
  rows?: number;
  /** Draw the search box placeholder above the table. */
  searchable?: boolean;
}

/**
 * Mirrors `DataTable`'s desktop shape (optional search box, header row, body rows)
 * so the space reserved while admin data loads matches what replaces it. A fixed
 * spinner box was always shorter than the real table, which guaranteed a jump.
 */
export function AdminTableSkeleton({
  columns = 5,
  rows = 5,
  searchable = false,
}: AdminTableSkeletonProps) {
  return (
    <LoadingRegion label="טוען נתונים">
      {searchable && (
        <div className="mb-4 max-w-sm">
          <Skeleton className="h-11 w-full" />
        </div>
      )}
      <div className="overflow-hidden rounded-card border border-line/70 bg-surface-raised shadow-card">
        <div className="flex gap-6 border-b border-line/70 bg-surface-soft px-6 py-4">
          {Array.from({ length: columns }, (_, i) => (
            <Skeleton key={i} className="h-4 flex-1 rounded-field" />
          ))}
        </div>
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-6 border-b border-line/70 px-6 py-5 last:border-b-0"
          >
            {Array.from({ length: columns }, (_, colIndex) => (
              <Skeleton key={colIndex} className="h-5 flex-1 rounded-field" />
            ))}
          </div>
        ))}
      </div>
    </LoadingRegion>
  );
}
