export interface ICategory {
  _id: {
    $oid: string;
  };
  title: string;
  urlCode: string;
  createdAt: {
    $date: string;
  };
  updatedAt: {
    $date: string;
  };
  __v: number;
}
export const categories: ICategory[] = [
  {
    _id: {
      $oid: '65c5e05281fb0d698a8c05c8',
    },
    title: 'תכנון ועיצוב בתים',
    urlCode: 'privateHouses',
    createdAt: {
      $date: '2024-02-09T08:20:34.023Z',
    },
    updatedAt: {
      $date: '2024-02-09T08:20:34.023Z',
    },
    __v: 0,
  },
  {
    _id: {
      $oid: '65c5e08181fb0d698a8c05ca',
    },
    title: 'שיפוץ ועיצוב דירות',
    urlCode: 'apartments',
    createdAt: {
      $date: '2024-02-09T08:21:21.739Z',
    },
    updatedAt: {
      $date: '2024-02-09T08:21:21.739Z',
    },
    __v: 0,
  },
  {
    _id: {
      $oid: '65c5e09981fb0d698a8c05cc',
    },
    title: 'תכנון ועיצוב חללים מסחריים',
    urlCode: 'publicSpaces',
    createdAt: {
      $date: '2024-02-09T08:21:45.644Z',
    },
    updatedAt: {
      $date: '2024-02-09T08:21:45.644Z',
    },
    __v: 0,
  },
];

export const categoriesCodeToTitleMap = categories.reduce(
  (acc: Record<string, string>, e) => {
    acc[e.urlCode] = e.title;
    return acc;
  },
  {},
);
