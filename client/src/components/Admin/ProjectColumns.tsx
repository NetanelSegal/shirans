import type { ColumnConfig } from '@/components/Admin/DataTable';
import type { CategoryResponse, ProjectResponse } from '@shirans/shared';

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
        <button
          type="button"
          onClick={() => void onToggleFavourite(row)}
          className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
            row.favourite ? 'bg-amber-400 text-black' : 'bg-gray-200 text-gray-600'
          }`}
          aria-label={row.favourite ? 'הסר ממועדפים' : 'הוסף למועדפים'}
        >
          <i className="fa-solid fa-star" aria-hidden />
        </button>
      ),
    },
    {
      key: 'isCompleted',
      header: 'הושלם',
      render: (row: ProjectResponse) => (
        <button
          type="button"
          onClick={() => void onToggleCompleted(row)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            row.isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          aria-label={row.isCompleted ? 'סמן כלא הושלם' : 'סמן כהושלם'}
        >
          {row.isCompleted ? 'כן' : 'לא'}
        </button>
      ),
    },
  ];
}
