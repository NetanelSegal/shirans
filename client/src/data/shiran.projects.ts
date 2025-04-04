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

import p3_img1 from './project3/images/1.jpg';
import p3_img2 from './project3/images/2.jpg';
import p3_img3 from './project3/images/3.jpg';
import p3_img4 from './project3/images/4.jpg';
import p3_img5 from './project3/images/5.jpg';
import p3_img6 from './project3/images/6.jpg';
import p3_img7 from './project3/images/7.jpg';
import p3_img8 from './project3/images/8.jpg';
import p3_img9 from './project3/images/9.jpg';
import p3_imgMain from './project3/images/main.jpg';
import p3_plan1 from './project3/plans/1.jpg';
import p3_plan2 from './project3/plans/2.jpg';

import p4_img1 from './project4/images/1.jpg';
import p4_img2 from './project4/images/2.jpg';
import p4_img3 from './project4/images/3.jpg';
import p4_img4 from './project4/images/4.jpg';
import p4_img5 from './project4/images/5.jpg';
import p4_img6 from './project4/images/6.jpg';
import p4_imgMain from './project4/images/1.jpg';
import p4_plan1 from './project4/plans/2.jpg';
import p4_video1 from './project4/videos/1.mp4';
import p4_video2 from './project4/videos/2.mp4';

export interface IProject {
  _id: string;
  title: string;
  categories: string[];
  description: string;
  mainImage: string;
  images: string[];
  plans: string[];
  videos?: string[];
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
התוצאה: בית שמחבר בין דורות, שומר על המשפחתיות ומעניק לכל אחד את המקום האישי שלו - מקום שהוא לא רק בית, אלא סיפור של חיבור, עיצוב, ושורשים. בית במלוא מובן המילה.`,
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
    client: 'זוג + 1',
    isCompleted: true,
    constructionArea: 110,
    favourite: true,
  },
  {
    _id: '6723e461b0a875a1848156eb',
    title: 'בית של חלומות, בים של חיים - מחכה להתגשם',
    categories: ['privateHouses'],
    description: `זוג מקסים עם ארבעה ילדים פנה אליי ללוות אותם בתכנון בית חלומותיהם בפרדס חנה הכפרית. 
אחרי שנים של חיסכון ועבודה קשה, הם היו מוכנים להגשים את חלומם ולבנות בית פרטי, מרווח ומותאם בדיוק לצרכיהם.
בית רחב ידיים, עם חדר לכל ילד, מרחב אישי לצד אזורים משפחתיים מחבקים, וחיבור טבעי בין הפנים לחוץ. התכנון שם דגש על אור, אוויר, זרימה טבעית ונוחות מקסימלית - בית שמרגיש חם, פונקציונלי ומלא השראה.
בעקבות המצב הביטחוני בארץ, הפרויקט טרם הסתיים, אך התכנון כבר מוכן ומחכה לרגע שבו המשפחה תוכל סוף סוף לראות את החלום שלהם קורם עור וגידים
זהו בית של אהבה, שורשים, התחלה חדשה - ומקום שבו כל דלת שנפתחת תספר על העתיד שנבנה כאן, ביום הנכון.`,
    mainImage: p3_imgMain,
    images: [
      p3_img1,
      p3_img2,
      p3_img3,
      p3_img4,
      p3_img5,
      p3_img6,
      p3_img7,
      p3_img8,
      p3_img9,
    ],
    plans: [p3_plan1, p3_plan2],
    location: 'פרדס חנה',
    client: 'זוג + 4',
    isCompleted: false,
    constructionArea: 160,
    favourite: true,
  },
  {
    _id: '6723e461b0a875a184815123',
    categories: ['privateHouses'],
    client: 'זוג + 2',
    isCompleted: true,
    constructionArea: 130,
    favourite: true,
    location: 'גן שורק',
    title: 'להעניק חיים חדשים לבית של סבתא',
    description: `יש בתים שמספרים היסטוריה, שנושאים איתם זיכרונות, דור אחרי דור. הזוג המקסים הזה, יחד עם שני ילדיהם, קיבלו לידיהם את ביתה הישן של סבתא - בית בן 100 שנה, מלא באופי, אבל גם במציאות לא פשוטה: קירות מתפוררים, גג לא יציב וחללים צפופים שלא תואמים את צורכי המשפחה המודרנית.
החלום שלהם היה ברור - להפיח חיים חדשים בבית הזה, לשמר את הנשמה שבו, אבל להפוך אותו לבית מרווח, מואר ופונקציונלי שיתאים לשגרת החיים שלהם. תכננתי עבורם בית שעונה בדיוק על הצרכים שלהם: לכל ילד חדר משלו, משרד ביתי שישתלב בנוחות בחלל, מרפסת רחבה שפונה אל הנוף המרהיב של גן שורק, ושילוב חכם בין ישן לחדש - בין זיכרונות העבר לאורח החיים העכשווי.
זהו פרויקט שמביא איתו לא רק תכנון ועיצוב, אלא גם רגש עמוק וכבוד לשורשים המשפחתיים. בית חדש שקם מתוך הישן, עם כל מה שחשוב באמת: מרחב, אור, אוויר - והרבה אהבה.
`,
    plans: [p4_plan1],
    images: [p4_img1, p4_img2, p4_img3, p4_img4, p4_img5, p4_img6],
    videos: [p4_video1, p4_video2],
    mainImage: p4_imgMain,
  },
];
