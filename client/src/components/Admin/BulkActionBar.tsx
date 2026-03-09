import Button from '@/components/ui/Button';

interface BulkActionBarProps {
  selectedCount: number;
  onMarkRead?: () => void;
  onMarkUnread?: () => void;
  onPublish?: () => void;
  onUnpublish?: () => void;
  onDelete: () => void;
  onClearSelection: () => void;
  mode: 'leads' | 'contacts' | 'testimonials';
  isBusy?: boolean;
}

export function BulkActionBar({
  selectedCount,
  onMarkRead,
  onMarkUnread,
  onPublish,
  onUnpublish,
  onDelete,
  onClearSelection,
  mode,
  isBusy = false,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      dir="rtl"
      className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3"
      role="toolbar"
      aria-label="פעולות קבוצתיות"
    >
      <span className="text-sm font-medium text-gray-700">
        נבחרו {selectedCount} פריטים
      </span>
      <div className="flex flex-wrap gap-2">
        {(mode === 'leads' || mode === 'contacts') && (
          <>
            {onMarkRead && (
              <Button
                variant="secondary"
                onClick={onMarkRead}
                disabled={isBusy}
                aria-label="סמן כנקרא"
              >
                סמן כנקרא
              </Button>
            )}
            {onMarkUnread && (
              <Button
                variant="secondary"
                onClick={onMarkUnread}
                disabled={isBusy}
                aria-label="סמן כלא נקרא"
              >
                סמן כלא נקרא
              </Button>
            )}
          </>
        )}
        {mode === 'testimonials' && (
          <>
            {onPublish && (
              <Button
                variant="secondary"
                onClick={onPublish}
                disabled={isBusy}
                aria-label="פרסם"
              >
                פרסם
              </Button>
            )}
            {onUnpublish && (
              <Button
                variant="secondary"
                onClick={onUnpublish}
                disabled={isBusy}
                aria-label="בטל פרסום"
              >
                בטל פרסום
              </Button>
            )}
          </>
        )}
        <Button
          variant="light"
          onClick={onDelete}
          disabled={isBusy}
          className="!bg-red-500 !text-white hover:!bg-red-600"
          aria-label="מחק נבחרים"
        >
          מחיקה
        </Button>
        <Button variant="light" onClick={onClearSelection} disabled={isBusy} aria-label="נקה בחירה">
          ביטול בחירה
        </Button>
      </div>
    </div>
  );
}
