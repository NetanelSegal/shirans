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

export function getProjectColumns(
  categories: CategoryResponse[],
  onToggleFavourite: (p: ProjectResponse) => void | Promise<void>,
  onToggleCompleted: (p: ProjectResponse) => void | Promise<void>,
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
      render: (row: ProjectResponse) => (
        <Button
          type="button"
          variant={row.favourite ? 'warning' : 'light'}
          onClick={() => void onToggleFavourite(row)}
          className={`${tableControlClass} ${row.favourite ? '' : '!text-gray-600'}`}
          ariaLabel={row.favourite ? 'הסר ממועדפים' : 'הוסף למועדפים'}
        >
          <i className="fa-solid fa-star" aria-hidden />
        </Button>
      ),
    },
    {
      key: 'isCompleted',
      header: 'הושלם',
      render: (row: ProjectResponse) => (
        <Button
          type="button"
          variant={row.isCompleted ? 'success' : 'light'}
          onClick={() => void onToggleCompleted(row)}
          className={`${tableControlClass} ${row.isCompleted ? '' : '!text-gray-700'}`}
          ariaLabel={row.isCompleted ? 'סמן כלא הושלם' : 'סמן כהושלם'}
        >
          {row.isCompleted ? 'כן' : 'לא'}
        </Button>
      ),
    },
  ];
}
