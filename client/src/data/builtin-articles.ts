import type { ArticleResponse } from '@shirans/shared';
import { SITE_IMAGES, type SiteImage } from '@/constants/siteImages';

/**
 * Magazine articles that live in the code rather than the admin.
 *
 * Articles are normally written in the admin and stored in the database. This
 * one was written for search (27.11.2026) before it could be added there, so
 * the blog list and the article page merge it in (hooks/useArticles.ts) and it
 * looks like any other post. To move it to the admin: create an article there
 * with the same slug and content, then delete it from this file.
 */

/** The widest file of a site image, for the cover and the share card. */
const largest = (image: SiteImage) => image.sources[image.sources.length - 1][1];

const ARCHITECT_FEES_BODY = `
<p>"כמה עולה אדריכל?" היא אחת השאלות הראשונות שמשפחות שואלות לפני שהן מתחילות לבנות בית. התשובה הקצרה: אין מחיר אחד. כל בית שונה בגודל, במגרש, במורכבות התכנון ובהיקף הליווי שאתם צריכים. במאמר הזה אסביר ממה מורכב שכר האדריכל, מה משפיע עליו, ואיך משווים בין הצעות בצורה נכונה.</p>

<h2>איך מחושב שכר אדריכל לבית פרטי</h2>
<p>בשוק מקובלות שתי שיטות עיקריות. הראשונה היא אחוז מעלות הבנייה: שכר האדריכל נגזר מהתקציב הכולל של הבנייה, ולכן גדל ככל שהבית גדול ומורכב יותר. השנייה היא מחיר לפי מטר רבוע של שטח מתוכנן. יש גם משרדים שעובדים במחיר גלובלי לפרויקט, אחרי שהגדירו מראש את היקף העבודה.</p>
<p>כל שיטה לגיטימית. מה שחשוב באמת הוא לדעת בדיוק מה כלול במחיר, ולא רק כמה הוא.</p>

<h2>מה משפיע על המחיר</h2>
<ul>
<li><strong>גודל הבית:</strong> שטח הבנייה ומספר הקומות.</li>
<li><strong>מורכבות התכנון:</strong> מגרש בשיפוע, מרתף, קירות תומכים, בריכה או דרישות מיוחדות.</li>
<li><strong>רישוי:</strong> האם ההצעה כוללת את הכנת תוכניות ההגשה והטיפול בהיתר מול הוועדה.</li>
<li><strong>עיצוב פנים:</strong> תוכניות נגרות, תאורה, חשמל ובחירת חומרים.</li>
<li><strong>ליווי בביצוע:</strong> ביקורים בשטח, מענה לקבלן ולספקים ופתרון בעיות בזמן הבנייה.</li>
</ul>

<h2>ממה מורכב שכר האדריכל</h2>
<h3>תכנון אדריכלי</h3>
<p>החלק הבסיסי הוא התכנון עצמו: פרוגרמה, סקיצות, הדמיות ותוכניות מפורטות. ככל שהבית גדול ומורכב יותר, יש יותר שעות עבודה בתכנון.</p>
<h3>רישוי והיתר בנייה</h3>
<p>הכנת תוכניות ההגשה, תיאום הקונסטרוקטור והיועצים והטיפול מול הוועדה עד קבלת ההיתר. זה שלב ארוך שדורש ידע וזמן, ולכן חשוב לבדוק אם הוא כלול בהצעה.</p>
<h3>עיצוב פנים ותוכניות עבודה</h3>
<p>חלק מהלקוחות בוחרים בתכנון אדריכלי בלבד, וחלק בליווי מלא שכולל גם את הפנים. ליווי מלא חוסך תיאומים בין אנשי מקצוע, ושומר על שפה אחת לכל הבית.</p>
<h3>ליווי בביצוע</h3>
<p>הליווי בשטח הוא מה ששומר על כך שהבית שנבנה הוא הבית שתוכנן. בלעדיו, החלטות קטנות מתקבלות בשטח בלי האדריכלית, ולפעמים עולות ביוקר.</p>

<h2>איך משווים בין הצעות מחיר</h2>
<p>כשמשווים הצעות, בדקו מה כלול בכל אחת: כמה סבבי סקיצות, האם יש הדמיות, האם הרישוי כלול, האם יש תוכניות עבודה מפורטות לקבלן, והאם יש ליווי בביצוע. הצעה זולה שלא כוללת ליווי או תוכניות מפורטות עלולה לעלות יותר בשטח, כי כל פרט שלא תוכנן מראש נפתר תוך כדי עבודה.</p>
<p>כדאי לשאול גם איך מתחלק התשלום. ברוב המקרים הוא מחולק לפי שלבי העבודה: תכנון ראשוני, תוכניות להיתר, תוכניות עבודה וליווי.</p>

<h2>איך מתחילים</h2>
<p>כדי לקבל תמונה ראשונית של עלות הבנייה עצמה, אפשר להשתמש ב<a href="/calculator">מחשבון האומדן באתר</a>. אחרי שיחת היכרות על הבית, המגרש והליווי שאתם צריכים, אשלח לכם הצעה מסודרת עם פירוט של מה שכלול בה. אפשר לקרוא עוד על <a href="/private-house-architecture">תכנון בית פרטי</a> ועל <a href="/architecture-permits">רישוי והיתרי בנייה</a>.</p>
`.trim();

export const BUILTIN_ARTICLES: ArticleResponse[] = [
  {
    id: 'builtin-architect-fees',
    title: 'כמה עולה אדריכל לבית פרטי?',
    slug: 'architect-fees',
    excerpt:
      'ממה מורכב שכר אדריכל לבית פרטי, מה משפיע על המחיר, ואיך משווים בין הצעות בצורה נכונה.',
    body: ARCHITECT_FEES_BODY,
    coverImage: largest(SITE_IMAGES.serviceLicensing),
    coverImageAlt: SITE_IMAGES.serviceLicensing.alt,
    coverImagePublicId: null,
    category: 'תקציב ועלויות',
    readingMinutes: 4,
    faq: [
      {
        question: 'כמה אחוז לוקח אדריכל מעלות הבנייה?',
        answer:
          'בשוק מקובל טווח של כמה אחוזים מעלות הבנייה, בהתאם להיקף העבודה. המחיר המדויק נקבע אחרי שיחת היכרות, לפי הפרויקט שלכם.',
      },
      {
        question: 'האם עיצוב הפנים כלול בשכר האדריכל?',
        answer:
          'לא תמיד. אפשר לקבל תכנון אדריכלי בלבד, או ליווי מלא שכולל גם עיצוב פנים. ההצעה צריכה לפרט מה כלול.',
      },
      {
        question: 'מתי משלמים?',
        answer:
          'התשלום מתחלק בדרך כלל לפי שלבי העבודה: תכנון ראשוני, תוכניות להיתר, תוכניות עבודה וליווי.',
      },
      {
        question: 'אפשר להתחיל בלי להתחייב לתכנון מלא?',
        answer: 'כן. אפשר להתחיל בייעוץ אדריכלי ממוקד, ולהחליט אחריו אם להמשיך לתכנון מלא.',
      },
    ],
    seoTitle: 'כמה עולה אדריכל לבית פרטי? | שירן גלעד',
    seoDescription:
      'ממה מורכב שכר אדריכל לבית פרטי, מה משפיע על המחיר, ואיך משווים בין הצעות. כולל מחשבון אומדן עלות בנייה ושיחת היכרות ללא התחייבות.',
    published: true,
    publishedAt: '2026-11-27T00:00:00.000Z',
    createdAt: '2026-11-27T00:00:00.000Z',
    updatedAt: '2026-11-27T00:00:00.000Z',
  },
];

export const getBuiltinArticle = (slug: string | undefined) =>
  BUILTIN_ARTICLES.find((article) => article.slug === slug);

/** Builtins merged into an API list: newest first, the API's copy wins on a shared slug. */
export function withBuiltinArticles<T extends { slug: string; publishedAt: string | null; createdAt: string }>(
  fromApi: T[],
  builtins: T[],
): T[] {
  const slugs = new Set(fromApi.map((a) => a.slug));
  const date = (a: T) => a.publishedAt ?? a.createdAt;
  return [...fromApi, ...builtins.filter((b) => !slugs.has(b.slug))].sort((a, b) =>
    date(b).localeCompare(date(a)),
  );
}
