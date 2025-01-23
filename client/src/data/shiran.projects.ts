import p1_img1 from './project1/images/1.png';
import p1_img2 from './project1/images/2.png';
import p1_img3 from './project1/images/3.png';
import p1_img4 from './project1/images/4.png';
import p1_img5 from './project1/images/5.png';
import p1_img6 from './project1/images/6.png';
import p1_img7 from './project1/images/7.png';
import p1_imgMain from './project1/images/main.png';
import p1_plan1 from './project1/plans/1.png';

export interface IProject {
  _id: string;
  title: string;
  categories: string[];
  description: string;
  mainImage: string;
  images: string[];
  plans: string[];
  location: string;
  client: string;
  isCompleted: boolean;
  constructionArea: number;
  favourite: boolean;
  createdAt?: {
    $date: string;
  };
  updatedAt?: {
    $date: string;
  };
  __v?: number;
}

export const projects: IProject[] = [
  {
    _id: '6723e461b0a875a1848156e9',
    title:
      'זוג צעיר ומקסים הגיע למשרדי לאחר תהליך כואב ומתסכל עם אדריכלית קודמת, שלא הצליחה לפתור את האתגרים שעמדו בפניהם.',
    categories: ['privateHouses'],
    description: `אחרי שנים של חיסכון ועבודה קשה, הם חלמו לבנות את ביתם במושב ילדותם. זכיתי לקחת חלק במסע
הזה ולעזור להם להפוך את החלום למציאות.
התמודדנו עם אתגרים לא פשוטים: שטחי בנייה מוגבלים מול רצונות רבים, מציאת קבלן בחודשי
המלחמה הראשונים, עליית מחירים מתמדת, ודרישותמורכבות שהביאו עמן חששות .
בעזרת תכנון מדויק, חשיבה יצירתית ושיתוף פעולה מלא, הצלחתי לפתור את כל הבעיות שלא קיבלו
מענה לפני כן. בסופו של דבר, בנינו עבורם בית שמגלם את כל מה שחלמו עליו–מקום חמים,
פונקציונלי ומיוחד, שמשקף את האישיות והחלומות שלהם.`,
    mainImage: p1_imgMain,
    images: [p1_img1, p1_img2, p1_img3, p1_img4, p1_img5, p1_img6, p1_img7],
    plans: [p1_plan1],
    location: 'שכניה',
    client: 'זוג + 1',
    isCompleted: true,
    constructionArea: 74 + 45,
    favourite: true,
  },
  {
    _id: '6723e461b0a875a1848156ea',
    title: 'Modern Apartment Complex',
    categories: ['apartments'],
    description: 'A contemporary apartment complex in the city center.',
    mainImage: 'https://placehold.co/950x500',
    images: ['https://placehold.co/700x450', 'https://placehold.co/600x400'],
    plans: ['https://placehold.co/850x550', 'https://placehold.co/750x500'],
    location: '45 Central Avenue',
    client: 'Urban Development Corp.',
    isCompleted: false,
    constructionArea: 2000,
    favourite: false,
  },
  {
    _id: '6723e461b0a875a1848156eb',
    title: 'Community Park Project',
    categories: ['publicSpaces'],
    description: 'A new community park with green spaces and playgrounds.',
    mainImage: 'https://placehold.co/1000x700',
    images: ['https://placehold.co/800x500'],
    plans: ['https://placehold.co/950x600'],
    location: 'Parkside Blvd',
    client: 'City Council',
    isCompleted: true,
    constructionArea: 3000,
    favourite: true,
  },
  {
    _id: '6723e461b0a875a1848156ec',
    title: 'Seaside Apartments',
    categories: ['apartments'],
    description: 'Beachfront apartments with stunning ocean views.',
    mainImage: 'https://placehold.co/850x500',
    images: ['https://placehold.co/750x450'],
    plans: ['https://placehold.co/800x500', 'https://placehold.co/950x650'],
    location: 'Ocean Drive 2',
    client: 'Coastal Living Inc.',
    isCompleted: false,
    constructionArea: 1600,
    favourite: true,
  },
  {
    _id: '6723e461b0a875a1848156ed',
    title: 'Luxury Private Residence',
    categories: ['privateHouses'],
    description: 'A high-end private residence with top-tier amenities.',
    mainImage: 'https://placehold.co/1100x700',
    images: ['https://placehold.co/900x600', 'https://placehold.co/800x500'],
    plans: ['https://placehold.co/950x550'],
    location: '789 Maple St',
    client: 'Jane Smith',
    isCompleted: true,
    constructionArea: 500,
    favourite: false,
  },
  {
    _id: '6723e461b0a875a1848156ee',
    title: 'City Plaza Public Space',
    categories: ['publicSpaces'],
    description: 'A public plaza with shops, cafes, and open-air seating.',
    mainImage: 'https://placehold.co/1000x650',
    images: ['https://placehold.co/850x550'],
    plans: ['https://placehold.co/950x600', 'https://placehold.co/700x400'],
    location: 'Downtown Square',
    client: 'City Council',
    isCompleted: false,
    constructionArea: 2500,
    favourite: true,
  },
  {
    _id: '6723e461b0a875a1848156ef',
    title: 'Urban Apartments',
    categories: ['apartments'],
    description: 'Affordable housing apartments in an urban area.',
    mainImage: 'https://placehold.co/1000x600',
    images: ['https://placehold.co/750x450'],
    plans: ['https://placehold.co/800x550', 'https://placehold.co/900x600'],
    location: 'Westside Street',
    client: 'Affordable Living Initiative',
    isCompleted: true,
    constructionArea: 1800,
    favourite: false,
  },
  {
    _id: '6723e461b0a875a1848156f0',
    title: 'Hillside Manor',
    categories: ['privateHouses'],
    description: 'An exclusive hillside private residence.',
    mainImage: 'https://placehold.co/1000x500',
    images: ['https://placehold.co/800x400'],
    plans: ['https://placehold.co/850x450'],
    location: '456 Highland Ave',
    client: 'Elite Homes',
    isCompleted: true,
    constructionArea: 350,
    favourite: false,
  },
  {
    _id: '6723e461b0a875a1848156f1',
    title: 'City Park Development',
    categories: ['publicSpaces'],
    description: 'A modern public park with walking trails and benches.',
    mainImage: 'https://placehold.co/1050x550',
    images: ['https://placehold.co/900x500', 'https://placehold.co/600x400'],
    plans: ['https://placehold.co/1000x600'],
    location: 'East End Park',
    client: 'Municipal Department',
    isCompleted: false,
    constructionArea: 2200,
    favourite: true,
  },
  {
    _id: '6723e461b0a875a1848156f2',
    title: 'Lakeside Apartments',
    categories: ['apartments'],
    description: 'Scenic lakeside apartments with modern amenities.',
    mainImage: 'https://placehold.co/900x500',
    images: ['https://placehold.co/800x450'],
    plans: ['https://placehold.co/850x500'],
    location: 'Lakeview Blvd',
    client: 'Green Living Group',
    isCompleted: true,
    constructionArea: 1400,
    favourite: false,
  },
  {
    _id: '6723ee7c80566c971aa98f43',
    title: 'asdasdasdasd',
    categories: ['apartments', 'publicSpaces'],
    description: 'sadasdasdasdasdasdasdasdad',
    mainImage: 'https://placehold.co/900x500',
    images: [],
    plans: [],
    location: 'second project',
    client: 'second project',
    isCompleted: true,
    constructionArea: 500,
    favourite: false,
    createdAt: {
      $date: '2024-10-31T20:54:20.741Z',
    },
    updatedAt: {
      $date: '2024-10-31T20:54:20.741Z',
    },
    __v: 0,
  },
  {
    _id: '6723f17380566c971aa99704',
    title: 'test test',
    categories: ['privateHouses', 'apartments'],
    mainImage: 'https://placehold.co/900x500',
    description: 'asdtest testtest testtest testtest testtest testtest test',
    images: [],
    plans: [],
    location: 'test test',
    client: 'second project',
    isCompleted: false,
    constructionArea: 123,
    favourite: false,
    createdAt: {
      $date: '2024-10-31T21:06:59.904Z',
    },
    updatedAt: {
      $date: '2024-10-31T21:06:59.904Z',
    },
    __v: 0,
  },
  {
    _id: '6723f1c980566c971aa99709',
    title: 'teststestset',
    categories: ['publicSpaces'],
    description:
      'teststestsetteststestsetteststestsetteststestsetteststestsetteststestsetteststestsetteststestsetteststestsetteststestsetteststestsetteststestsetteststestsetteststestsetteststestsetteststestset',
    mainImage: 'https://placehold.co/900x500',
    images: [],
    plans: [],
    location: 'teststestset',
    client: 'asd',
    isCompleted: false,
    constructionArea: 123,
    favourite: false,
    createdAt: {
      $date: '2024-10-31T21:08:25.015Z',
    },
    updatedAt: {
      $date: '2024-10-31T21:08:25.015Z',
    },
    __v: 0,
  },
];
