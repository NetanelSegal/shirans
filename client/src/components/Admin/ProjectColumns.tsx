import type { ColumnConfig } from '@/components/Admin/DataTable';
import Button from '@/components/ui/Button';
import type { CategoryResponse, ProjectResponse } from '@shirans/shared';

const tableControlClass = '!rounded-lg !px-3 !py-1.5 text-sm font-medium';

function getCategoryTitles(
  project: ProjectResponse,
  categories: CategoryResponse[],
) {
  return (
    (project.categories ?? [])
      .map((urlCode) => categories.find((c) => c.urlCode === urlCode)?.title)
      .filter(Boolean)
      .join(', ') || '-'
  );
}

export interface ProjectColumnPendingState {
  favouriteId: string | null;
  completedId: string | null;
}

export function getProjectColumns(
  categories: CategoryResponse[],
  onToggleFavourite: (p: ProjectResponse) => void | Promise<void>,
  onToggleCompleted: (p: ProjectResponse) => void | Promise<void>,
  pending: ProjectColumnPendingState = { favouriteId: null, completedId: null },
): ColumnConfig<ProjectResponse>[] {
  return [
    {
      key: 'title',
      header: 'כותרת',
      render: (row: ProjectResponse) => row.title,
    },
    {
      key: 'location',
      header: 'מיקום',
      render: (row: ProjectResponse) => row.location,
    },
    {
      key: 'categories',
      header: 'קטגוריות',
      render: (row: ProjectResponse) => getCategoryTitles(row, categories),
    },
    {
      key: 'favourite',
      header: 'מועדף',
      render: (row: ProjectResponse) => {
        const isPending = pending.favouriteId === row.id;
        return (
          <Button
            type="button"
            variant={row.favourite ? 'warning' : 'light'}
            onClick={() => void onToggleFavourite(row)}
            disabled={isPending}
            className={`${tableControlClass} ${row.favourite ? '' : '!text-gray-600'}`}
            ariaLabel={row.favourite ? 'הסר ממועדפים' : 'הוסף למועדפים'}
          >
            {isPending ? (
              <i className="fa-solid fa-spinner fa-spin" aria-hidden />
            ) : (
              <i className="fa-solid fa-star" aria-hidden />
            )}
          </Button>
        );
      },
    },
    {
      key: 'isCompleted',
      header: 'הושלם',
      render: (row: ProjectResponse) => {
        const isPending = pending.completedId === row.id;
        return (
          <Button
            type="button"
            variant={row.isCompleted ? 'success' : 'light'}
            onClick={() => void onToggleCompleted(row)}
            disabled={isPending}
            className={`${tableControlClass} ${row.isCompleted ? '' : '!text-gray-700'}`}
            ariaLabel={row.isCompleted ? 'סמן כלא הושלם' : 'סמן כהושלם'}
          >
            {isPending ? (
              <i className="fa-solid fa-spinner fa-spin" aria-hidden />
            ) : (
              (row.isCompleted ? 'כן' : 'לא')
            )}
          </Button>
        );
      },
    },
  ];
}
