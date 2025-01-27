import p1_img1 from './project1/images/1.png';
import p1_img2 from './project1/images/2.png';
import p1_img3 from './project1/images/3.png';
import p1_img4 from './project1/images/4.png';
import p1_img5 from './project1/images/5.png';
import p1_img6 from './project1/images/6.png';
import p1_img7 from './project1/images/7.png';
import p1_imgMain from './project1/images/main.png';
import p1_plan1 from './project1/plans/1.png';

import p2_img1 from './project2/images/1.png';
import p2_img2 from './project2/images/2.png';
import p2_img3 from './project2/images/3.png';
import p2_img4 from './project2/images/4.png';
import p2_img5 from './project2/images/5.png';
import p2_img6 from './project2/images/6.png';
import p2_img7 from './project2/images/7.png';
import p2_img8 from './project2/images/8.png';
import p2_img9 from './project2/images/9.png';
import p2_imgMain from './project2/images/main.png';
import p2_plan1 from './project2/plans/1.png';

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
    title: 'תכנון ובנייה של בית מגורים לזוג צעיר במושב ילדותם',
    categories: ['privateHouses'],
    description: `זוג צעיר ומקסים הגיע למשרדי לאחר תהליך כואב ומתסכל עם אדריכלית קודמת, שלא הצליחה לפתור את האתגרים שעמדו בפניהם.
אחרי שנים של חיסכון ועבודה קשה, הם חלמו לבנות את ביתם במושב ילדותם. זכיתי לקחת חלק במסע הזה ולעזור להם להפוך את החלום למציאות.
התמודדנו עם אתגרים לא פשוטים: שטחי בנייה מוגבלים מול רצונות רבים, מציאת קבלן בחודשי המלחמה הראשונים, עליית מחירים מתמדת, ודרישות מורכבות שהביאו עמן חששות.
בעזרת תכנון מדויק, חשיבה יצירתית ושיתוף פעולה מלא, הצלחתי לפתור את כל הבעיות שלא קיבלו מענה לפני כן. בסופו של דבר, בנינו עבורם בית שמגלם את כל מה שחלמו עליו - מקום חמים, פונקציונלי ומיוחד, שמשקף את האישיות והחלומות שלהם`,
    mainImage: p1_imgMain,
    images: [p1_img1, p1_img2, p1_img3, p1_img4, p1_img5, p1_img6, p1_img7],
    plans: [p1_plan1],
    location: 'שכניה',
    client: 'זוג + 1',
    isCompleted: true,
    constructionArea: 120,
    favourite: true,
  },
  {
    _id: '6723e461b0a875a1848156ea',
    title: 'משפחה, חיבור ועיצוב שמספר סיפור',
    categories: ['privateHouses'],
    description: `זוג צעיר ומקסים, שכבר זכיתי לתכנן עבורם את ביתם הראשון, פנו אליי שוב עם בקשה ייחודית ומלאת משמעות: לתכנן ולעצב עבורם בית חדש, מחובר לבית של אמא אך עם כניסה נפרדת ועצמאות מלאה.
המטרה הייתה לשלב בין חיבור משפחתי לבין יצירת פרטיות ונפרדות לכל משפחה, תוך שמירה על זרימה טבעית ונעימה בין שני הבתים.
בעבודה משותפת ובהבנה מעמיקה של הצרכים, תכננתי בית שמהווה המשך ישיר לבית אמא - אך בו זמנית עומד בפני עצמו כמרחב נעים, פונקציונלי ומודרני.
התוצאה: בית שמחבר בין דורות, שומר על המשפחתיות ומעניק לכל אחד את המקום האישי שלו - מקום שהוא לא רק בית, אלא סיפור של חיבור, עיצוב, ושורשים. בית במלוא מובן המילה.
`,
    mainImage: p2_imgMain,
    images: [
      p2_img1,
      p2_img2,
      p2_img3,
      p2_img4,
      p2_img5,
      p2_img6,
      p2_img7,
      p2_img8,
      p2_img9,
    ],
    plans: [p2_plan1],
    location: 'גן שורק',
    client: 'זוג + 1.',
    isCompleted: true,
    constructionArea: 110,
    favourite: true,
  },
];
