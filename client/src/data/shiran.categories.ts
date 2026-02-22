import type { CategoryResponse } from '@shirans/shared';

export const categories: Pick<CategoryResponse, 'id' | 'title' | 'urlCode'>[] = [
  {
    id: '65c5e05281fb0d698a8c05c8',
    title: 'תכנון ועיצוב בתים',
    urlCode: 'privateHouses',
  },
  {
    id: '65c5e08181fb0d698a8c05ca',
    title: 'שיפוץ ועיצוב דירות',
    urlCode: 'apartments',
  },
  {
    id: '65c5e09981fb0d698a8c05cc',
    title: 'תכנון ועיצוב חללים מסחריים',
    urlCode: 'publicSpaces',
  },
];

export const categoriesCodeToTitleMap = categories.reduce(
  (acc: Record<string, string>, e) => {
    acc[e.urlCode] = e.title;
    return acc;
  },
  {} as Record<string, string>,
);
