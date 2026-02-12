import { PrismaClient, CategoryUrlCode, ProjectImageType } from '@prisma/client';

const prisma = new PrismaClient();

interface SeedProject {
  title: string;
  description: string;
  location: string;
  client: string;
  isCompleted: boolean;
  constructionArea: number;
  favourite: boolean;
  categoryCode: CategoryUrlCode;
  images: Array<{
    url: string;
    type: ProjectImageType;
    order: number;
  }>;
}

const categoriesData = [
  { title: 'תכנון ועיצוב בתים', urlCode: CategoryUrlCode.privateHouses },
  { title: 'שיפוץ ועיצוב דירות', urlCode: CategoryUrlCode.apartments },
  { title: 'תכנון ועיצוב חללים מסחריים', urlCode: CategoryUrlCode.publicSpaces },
] as const;

const projectsData: SeedProject[] = [
  {
    title: 'תכנון ובנייה של בית מגורים לזוג צעיר במושב ילדותם',
    description: `זוג צעיר ומקסים הגיע למשרדי לאחר תהליך כואב ומתסכל עם אדריכלית קודמת, שלא הצליחה לפתור את האתגרים שעמדו בפניהם.
אחרי שנים של חיסכון ועבודה קשה, הם חלמו לבנות את ביתם במושב ילדותם. זכיתי לקחת חלק במסע הזה ולעזור להם להפוך את החלום למציאות.
התמודדנו עם אתגרים לא פשוטים: שטחי בנייה מוגבלים מול רצונות רבים, מציאת קבלן בחודשי המלחמה הראשונים, עליית מחירים מתמדת, ודרישות מורכבות שהביאו עמן חששות.
בעזרת תכנון מדויק, חשיבה יצירתית ושיתוף פעולה מלא, הצלחתי לפתור את כל הבעיות שלא קיבלו מענה לפני כן. בסופו של דבר, בנינו עבורם בית שמגלם את כל מה שחלמו עליו - מקום חמים, פונקציונלי ומיוחד, שמשקף את האישיות והחלומות שלהם`,
    location: 'שכניה',
    client: 'זוג + 1',
    isCompleted: true,
    constructionArea: 120,
    favourite: true,
    categoryCode: CategoryUrlCode.privateHouses,
    images: [
      { url: '/uploads/projects/project1/images/main_desktop.webp', type: ProjectImageType.MAIN, order: 0 },
      { url: '/uploads/projects/project1/images/1_desktop.webp', type: ProjectImageType.IMAGE, order: 1 },
      { url: '/uploads/projects/project1/images/2_desktop.webp', type: ProjectImageType.IMAGE, order: 2 },
      { url: '/uploads/projects/project1/images/3_desktop.webp', type: ProjectImageType.IMAGE, order: 3 },
      { url: '/uploads/projects/project1/images/4_desktop.webp', type: ProjectImageType.IMAGE, order: 4 },
      { url: '/uploads/projects/project1/images/5_desktop.webp', type: ProjectImageType.IMAGE, order: 5 },
      { url: '/uploads/projects/project1/images/6_desktop.webp', type: ProjectImageType.IMAGE, order: 6 },
      { url: '/uploads/projects/project1/plans/1_desktop.webp', type: ProjectImageType.PLAN, order: 0 },
    ],
  },
  {
    title: 'משפחה, חיבור ועיצוב שמספר סיפור',
    description: `זוג צעיר ומקסים, שכבר זכיתי לתכנן עבורם את ביתם הראשון, פנו אליי שוב עם בקשה ייחודית ומלאת משמעות: לתכנן ולעצב עבורם בית חדש, מחובר לבית של אמא אך עם כניסה נפרדת ועצמאות מלאה.
המטרה הייתה לשלב בין חיבור משפחתי לבין יצירת פרטיות ונפרדות לכל משפחה, תוך שמירה על זרימה טבעית ונעימה בין שני הבתים.
בעבודה משותפת ובהבנה מעמיקה של הצרכים, תכננתי בית שמהווה המשך ישיר לבית אמא - אך בו זמנית עומד בפני עצמו כמרחב נעים, פונקציונלי ומודרני.
התוצאה: בית שמחבר בין דורות, שומר על המשפחתיות ומעניק לכל אחד את המקום האישי שלו - מקום שהוא לא רק בית, אלא סיפור של חיבור, עיצוב, ושורשים. בית במלוא מובן המילה.`,
    location: 'גן שורק',
    client: 'זוג + 1',
    isCompleted: true,
    constructionArea: 110,
    favourite: true,
    categoryCode: CategoryUrlCode.privateHouses,
    images: [
      { url: '/uploads/projects/project2/images/main_desktop.webp', type: ProjectImageType.MAIN, order: 0 },
      { url: '/uploads/projects/project2/images/1_desktop.webp', type: ProjectImageType.IMAGE, order: 1 },
      { url: '/uploads/projects/project2/images/2_desktop.webp', type: ProjectImageType.IMAGE, order: 2 },
      { url: '/uploads/projects/project2/images/3_desktop.webp', type: ProjectImageType.IMAGE, order: 3 },
      { url: '/uploads/projects/project2/images/4_desktop.webp', type: ProjectImageType.IMAGE, order: 4 },
      { url: '/uploads/projects/project2/images/5_desktop.webp', type: ProjectImageType.IMAGE, order: 5 },
      { url: '/uploads/projects/project2/images/6_desktop.webp', type: ProjectImageType.IMAGE, order: 6 },
      { url: '/uploads/projects/project2/images/7_desktop.webp', type: ProjectImageType.IMAGE, order: 7 },
      { url: '/uploads/projects/project2/images/8_desktop.webp', type: ProjectImageType.IMAGE, order: 8 },
      { url: '/uploads/projects/project2/images/9_desktop.webp', type: ProjectImageType.IMAGE, order: 9 },
      { url: '/uploads/projects/project2/images/10_desktop.webp', type: ProjectImageType.IMAGE, order: 10 },
      { url: '/uploads/projects/project2/images/11_desktop.webp', type: ProjectImageType.IMAGE, order: 11 },
      { url: '/uploads/projects/project2/images/12_desktop.webp', type: ProjectImageType.IMAGE, order: 12 },
      { url: '/uploads/projects/project2/images/14_desktop.webp', type: ProjectImageType.IMAGE, order: 13 },
      { url: '/uploads/projects/project2/images/15_desktop.webp', type: ProjectImageType.IMAGE, order: 14 },
      { url: '/uploads/projects/project2/images/16_desktop.webp', type: ProjectImageType.IMAGE, order: 15 },
      { url: '/uploads/projects/project2/images/17_desktop.webp', type: ProjectImageType.IMAGE, order: 16 },
      { url: '/uploads/projects/project2/images/18_desktop.webp', type: ProjectImageType.IMAGE, order: 17 },
      { url: '/uploads/projects/project2/images/19_desktop.webp', type: ProjectImageType.IMAGE, order: 18 },
      { url: '/uploads/projects/project2/images/20_desktop.webp', type: ProjectImageType.IMAGE, order: 19 },
      { url: '/uploads/projects/project2/images/21_desktop.webp', type: ProjectImageType.IMAGE, order: 20 },
      { url: '/uploads/projects/project2/images/22_desktop.webp', type: ProjectImageType.IMAGE, order: 21 },
      { url: '/uploads/projects/project2/images/23_desktop.webp', type: ProjectImageType.IMAGE, order: 22 },
      { url: '/uploads/projects/project2/images/24_desktop.webp', type: ProjectImageType.IMAGE, order: 23 },
      { url: '/uploads/projects/project2/images/25_desktop.webp', type: ProjectImageType.IMAGE, order: 24 },
      { url: '/uploads/projects/project2/images/26_desktop.webp', type: ProjectImageType.IMAGE, order: 25 },
      { url: '/uploads/projects/project2/images/27_desktop.webp', type: ProjectImageType.IMAGE, order: 26 },
      { url: '/uploads/projects/project2/images/28_desktop.webp', type: ProjectImageType.IMAGE, order: 27 },
      { url: '/uploads/projects/project2/images/29_desktop.webp', type: ProjectImageType.IMAGE, order: 28 },
      { url: '/uploads/projects/project2/images/30_desktop.webp', type: ProjectImageType.IMAGE, order: 29 },
      { url: '/uploads/projects/project2/images/31_desktop.webp', type: ProjectImageType.IMAGE, order: 30 },
      { url: '/uploads/projects/project2/plans/1_desktop.webp', type: ProjectImageType.PLAN, order: 0 },
    ],
  },
  {
    title: 'בית של חלומות, בים של חיים - מחכה להתגשם',
    description: `זוג מקסים עם ארבעה ילדים פנה אליי ללוות אותם בתכנון בית חלומותיהם בפרדס חנה הכפרית.
אחרי שנים של חיסכון ועבודה קשה, הם היו מוכנים להגשים את חלומם ולבנות בית פרטי, מרווח ומותאם בדיוק לצרכיהם.
בית רחב ידיים, עם חדר לכל ילד, מרחב אישי לצד אזורים משפחתיים מחבקים, וחיבור טבעי בין הפנים לחוץ. התכנון שם דגש על אור, אוויר, זרימה טבעית ונוחות מקסימלית - בית שמרגיש חם, פונקציונלי ומלא השראה.
בעקבות המצב הביטחוני בארץ, הפרויקט טרם הסתיים, אך התכנון כבר מוכן ומחכה לרגע שבו המשפחה תוכל סוף סוף לראות את החלום שלהם קורם עור וגידים
זהו בית של אהבה, שורשים, התחלה חדשה - ומקום שבו כל דלת שנפתחת תספר על העתיד שנבנה כאן, ביום הנכון.`,
    location: 'פרדס חנה',
    client: 'זוג + 4',
    isCompleted: false,
    constructionArea: 160,
    favourite: true,
    categoryCode: CategoryUrlCode.privateHouses,
    images: [
      { url: '/uploads/projects/project3/images/main_desktop.webp', type: ProjectImageType.MAIN, order: 0 },
      { url: '/uploads/projects/project3/images/1_desktop.webp', type: ProjectImageType.IMAGE, order: 1 },
      { url: '/uploads/projects/project3/images/2_desktop.webp', type: ProjectImageType.IMAGE, order: 2 },
      { url: '/uploads/projects/project3/images/3_desktop.webp', type: ProjectImageType.IMAGE, order: 3 },
      { url: '/uploads/projects/project3/images/4_desktop.webp', type: ProjectImageType.IMAGE, order: 4 },
      { url: '/uploads/projects/project3/images/5_desktop.webp', type: ProjectImageType.IMAGE, order: 5 },
      { url: '/uploads/projects/project3/images/6_desktop.webp', type: ProjectImageType.IMAGE, order: 6 },
      { url: '/uploads/projects/project3/images/7_desktop.webp', type: ProjectImageType.IMAGE, order: 7 },
      { url: '/uploads/projects/project3/images/8_desktop.webp', type: ProjectImageType.IMAGE, order: 8 },
      { url: '/uploads/projects/project3/images/9_desktop.webp', type: ProjectImageType.IMAGE, order: 9 },
      { url: '/uploads/projects/project3/plans/1_desktop.webp', type: ProjectImageType.PLAN, order: 0 },
      { url: '/uploads/projects/project3/plans/2_desktop.webp', type: ProjectImageType.PLAN, order: 1 },
    ],
  },
  {
    title: 'להעניק חיים חדשים לבית של סבתא',
    description: `יש בתים שמספרים היסטוריה, שנושאים איתם זיכרונות, דור אחרי דור. הזוג המקסים הזה, יחד עם שני ילדיהם, קיבלו לידיהם את ביתה הישן של סבתא - בית בן 100 שנה, מלא באופי, אבל גם במציאות לא פשוטה: קירות מתפוררים, גג לא יציב וחללים צפופים שלא תואמים את צורכי המשפחה המודרנית.
החלום שלהם היה ברור - להפיח חיים חדשים בבית הזה, לשמר את הנשמה שבו, אבל להפוך אותו לבית מרווח, מואר ופונקציונלי שיתאים לשגרת החיים שלהם. תכננתי עבורם בית שעונה בדיוק על הצרכים שלהם: לכל ילד חדר משלו, משרד ביתי שישתלב בנוחות בחלל, מרפסת רחבה שפונה אל הנוף המרהיב של גן שורק, ושילוב חכם בין ישן לחדש - בין זיכרונות העבר לאורח החיים העכשווי.
זהו פרויקט שמביא איתו לא רק תכנון ועיצוב, אלא גם רגש עמוק וכבוד לשורשים המשפחתיים. בית חדש שקם מתוך הישן, עם כל מה שחשוב באמת: מרחב, אור, אוויר - והרבה אהבה.
`,
    location: 'גן שורק',
    client: 'זוג + 2',
    isCompleted: true,
    constructionArea: 130,
    favourite: true,
    categoryCode: CategoryUrlCode.privateHouses,
    images: [
      { url: '/uploads/projects/project4/images/main_desktop.webp', type: ProjectImageType.MAIN, order: 0 },
      { url: '/uploads/projects/project4/images/1_desktop.webp', type: ProjectImageType.IMAGE, order: 1 },
      { url: '/uploads/projects/project4/images/2_desktop.webp', type: ProjectImageType.IMAGE, order: 2 },
      { url: '/uploads/projects/project4/images/3_desktop.webp', type: ProjectImageType.IMAGE, order: 3 },
      { url: '/uploads/projects/project4/images/4_desktop.webp', type: ProjectImageType.IMAGE, order: 4 },
      { url: '/uploads/projects/project4/images/5_desktop.webp', type: ProjectImageType.IMAGE, order: 5 },
      { url: '/uploads/projects/project4/images/6_desktop.webp', type: ProjectImageType.IMAGE, order: 6 },
      { url: '/uploads/projects/project4/images/7_desktop.webp', type: ProjectImageType.IMAGE, order: 7 },
      { url: '/uploads/projects/project4/images/8_desktop.webp', type: ProjectImageType.IMAGE, order: 8 },
      { url: '/uploads/projects/project4/plans/2_desktop.webp', type: ProjectImageType.PLAN, order: 0 },
      { url: 'https://www.youtube.com/embed/XPgwUDZXKkk', type: ProjectImageType.VIDEO, order: 0 },
      { url: 'https://www.youtube.com/embed/Kn7jyqiiHck', type: ProjectImageType.VIDEO, order: 1 },
    ],
  },
  {
    title: 'בית הסבא בבנימינה - חידוש ממוקד בלב של בית',
    description: `בכל בית יש זיכרונות, אבל בבית של סבא - יש שורשים.
הבית הישן בבנימינה, שעמד במשך עשרות שנים עם כל ההיסטוריה והקסם שבו, עבר חידוש מדויק שהתמקד בלב הפועם של כל בית: המטבח והמקלחת.
`,
    location: 'בנימינה',
    client: 'זוג',
    isCompleted: true,
    constructionArea: 130,
    favourite: true,
    categoryCode: CategoryUrlCode.privateHouses,
    images: [
      { url: '/uploads/projects/project5/images/main_desktop.webp', type: ProjectImageType.MAIN, order: 0 },
      { url: '/uploads/projects/project5/images/1_desktop.webp', type: ProjectImageType.IMAGE, order: 1 },
      { url: '/uploads/projects/project5/images/2_desktop.webp', type: ProjectImageType.IMAGE, order: 2 },
      { url: '/uploads/projects/project5/images/3_desktop.webp', type: ProjectImageType.IMAGE, order: 3 },
      { url: '/uploads/projects/project5/images/4_desktop.webp', type: ProjectImageType.IMAGE, order: 4 },
    ],
  },
  {
    title: 'דירת שותפים ישנה בלב תל אביב - מהפך צעיר, פרקטי ומרשים',
    description: `דירה תל אביבית ישנה, בקומה ראשונה בלי מעלית, עם מטבח מתקלף, קירות סדוקים ומרווחים צפופים - הפכה תוך זמן קצר לדירת שותפים עדכנית, מרווחת ונעימה שכולם רוצים לגור בה.`,
    location: 'תל אביב',
    client: 'דירת שותפים',
    isCompleted: true,
    constructionArea: 130,
    favourite: true,
    categoryCode: CategoryUrlCode.privateHouses,
    images: [
      { url: '/uploads/projects/project6/images/main_desktop.webp', type: ProjectImageType.MAIN, order: 0 },
      { url: '/uploads/projects/project6/images/1_desktop.webp', type: ProjectImageType.IMAGE, order: 1 },
      { url: '/uploads/projects/project6/images/2_desktop.webp', type: ProjectImageType.IMAGE, order: 2 },
      { url: '/uploads/projects/project6/images/3_desktop.webp', type: ProjectImageType.IMAGE, order: 3 },
    ],
  },
];

const testimonialsData = [
  {
    name: 'משפחת קליין',
    message: `חד משמעית לא ראיתי בעלת מקצוע כזאת!!! התחלנו יחד תהליך של בניית בית פרטי מ0 שירן ליוותה אותנו ויש בה הכל..החל מראש פתוח..זמינות בשעות שלא תאמינו אבל כן היינו מתכתבים גם ב 12 בלילה חרוצה מקצועית יש לה תשובה הפיתרון לכל דבר ..יצירתית ובלי שתשימו לב עושה דברים שהיא לא אמורה לעשות בכלל בקיצור אני אישית ממליץ מאוד וכמובן שכבר העברתי לה כמה פרוייקטים ..כי פשוט מגיע לה
אם יש שאלות או רוצים לראות. את העבודה שלה תגידו לה שתפנה אותכם אליי`,
    isPublished: true,
    order: 0,
  },
  {
    name: 'משפחת חרבי',
    message: `איזה מזל יש לנו שהגענו אלייך!!!
כל כך מוכשרת, מסורה, מקצועית!
יש לך את כל התשובות והידע שצריך לתהליך הזה! ואת היכולת המטורפת להבין טוב טוב את האנשים שעומדים מולך!
ללמוד אותם, את החלומות שלהם, את הצרכים שלהם.. ולתרגם את זה לתכנון מושלם של בית החלומות!`,
    isPublished: true,
    order: 1,
  },
  {
    name: 'משפחת בקר',
    message: `בנית לנו בית לתפארת. היי לנו המון אילוצים וידעת בחוכמתך ובסינכרון רב לתכנן לנו בית בדיוק כפי שרצינו. הצלחת להתאים הכל למידות ולטעם שלנו. הכל היה אצלך כ״כ מדויק תוך הסתכלות על כל פרט: כל קיר, זווית, דלת, חלון וצבע. הנחת כל בעל מקצוע עם השרטוט המדויק שבנית לו וידעת לפתור לנו כל אילוץ בתכנון חלופי ובמקצועיות רבה. היית העוגן שלי בבית הזה ובזכותך היה לי ראש שקט. ידעת שאת יודעת טוב ממני ונתתי לך להחליט בעבורי את רוב ההחלטות ואכן צדקתי שסמכתי עליך. יש לנו בית שאנחנו לא רוצים לצאת ממנו. אנחנו מאוהבים. בזכותך. תודה רבה אשה מוכשרת שכמותך`,
    isPublished: true,
    order: 2,
  },
  {
    name: 'משפחת שמעון',
    message: `מהרגע הראשון היה ברור שמדובר בעבודה מקצועית ויסודית. התכנון נעשה מתוך הקשבה אמיתית לצרכים שלנו, הבנה עמוקה של המגבלות והאילוצים, וירידה לפרטים הקטנים ביותר. כל החלטה לוותה בהסבר ברור, חשיבה קדימה ופתרונות חכמים שהתאימו גם לתכנון וגם לביצוע בשטח.
הליווי היה מדויק, אחראי ועם נוכחות מלאה מול כל בעלי המקצוע, מה שנתן לנו שקט נפשי לאורך כל הדרך. הרגשנו שיש מי שמחזיק את הפרויקט, רואה את התמונה הגדולה ולא מפספס אף פרט קטן.
התוצאה היא בית מתוכנן היטב, נעים ונכון לנו כזה שמרגיש טבעי, מאוזן ובעיקר מחובר לאיך שאנחנו חיים באמת.
ממליצים מאוד למי שמחפש תכנון איכותי, חשיבה עמוקה וליווי שאפשר לסמוך עליו`,
    isPublished: true,
    order: 3,
  },
  {
    name: 'משפחת אביטל',
    message: `כבר מהפגישה הראשונה הרגשנו שיש על מי לסמוך. התהליך היה נעים, מסודר וברור, עם הרבה הקשבה ויכולת להבין בדיוק מה חשוב לנו גם בדברים שלא תמיד ידענו להגדיר בעצמנו.
הייתה זמינות, ירידה לפרטים ויכולת לפתור דברים תוך כדי תנועה, בצורה עניינית וחכמה. הכל התחבר בסוף לבית שמרגיש נכון לנו, לא מתאמץ
שמחים מאוד על הבחירה, וממליצים למי שמחפש ליווי מקצועי עם גישה אנושית וראש שקט לאורך כל הדרך.`,
    isPublished: true,
    order: 4,
  },
  {
    name: 'משפחת ניסים',
    message: `תכננו בית פרטי מאפס, ואחרי שבדקנו ודיברנו עם לא מעט אדריכלים, ושירן הייתה החלטה טובה. התהליך היה ברור ורגוע, עם הקשבה אמיתית לצרכים שלנו וחשיבה נכונה על כל פרט. הרגשנו שיש מי שמוביל את הפרויקט ויודע לקבל החלטות בזמן הנכון. בסוף קיבלנו בית שמתאים לנו באמת ונעים לנו לחיות בו. שמחים מאוד על הבחירה`,
    isPublished: true,
    order: 5,
  },
];

async function main() {
  console.log('Seeding database...');

  // Clear existing data (idempotent)
  await prisma.projectImage.deleteMany();
  await prisma.project.deleteMany();
  await prisma.category.deleteMany();
  await prisma.testimonial.deleteMany();

  // Seed categories
  const categories = await Promise.all(
    categoriesData.map((cat) =>
      prisma.category.create({
        data: { title: cat.title, urlCode: cat.urlCode },
      }),
    ),
  );
  console.log(`Seeded ${categories.length} categories`);

  const categoryMap = new Map(categories.map((c) => [c.urlCode, c.id]));

  // Seed projects with images
  for (const projectData of projectsData) {
    const categoryId = categoryMap.get(projectData.categoryCode);
    if (!categoryId) {
      throw new Error(`Category not found for code: ${projectData.categoryCode}`);
    }

    await prisma.project.create({
      data: {
        title: projectData.title,
        description: projectData.description,
        location: projectData.location,
        client: projectData.client,
        isCompleted: projectData.isCompleted,
        constructionArea: projectData.constructionArea,
        favourite: projectData.favourite,
        categories: { connect: [{ id: categoryId }] },
        images: {
          create: projectData.images.map((img) => ({
            url: img.url,
            type: img.type,
            order: img.order,
          })),
        },
      },
    });
  }
  console.log(`Seeded ${projectsData.length} projects`);

  // Seed testimonials
  await prisma.testimonial.createMany({
    data: testimonialsData,
  });
  console.log(`Seeded ${testimonialsData.length} testimonials`);

  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
