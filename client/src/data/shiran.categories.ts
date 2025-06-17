export type CategoryUrlCode = 'privateHouses' | 'apartments' | 'publicSpaces';

export interface ICategory {
  _id: {
    $oid: string;
  };
  title: string;
  urlCode: CategoryUrlCode;
}
export const categories: ICategory[] = [
  {
    _id: {
      $oid: '65c5e05281fb0d698a8c05c8',
    },
    title: 'תכנון ועיצוב בתים',
    urlCode: 'privateHouses',
  },
  {
    _id: {
      $oid: '65c5e08181fb0d698a8c05ca',
    },
    title: 'שיפוץ ועיצוב דירות',
    urlCode: 'apartments',
  },
  {
    _id: {
      $oid: '65c5e09981fb0d698a8c05cc',
    },
    title: 'תכנון ועיצוב חללים מסחריים',
    urlCode: 'publicSpaces',
  },
];

export const categoriesCodeToTitleMap = categories.reduce(
  (acc: Record<CategoryUrlCode, string>, e) => {
    acc[e.urlCode] = e.title;
    return acc;
  },
  {} as Record<CategoryUrlCode, string>,
);
