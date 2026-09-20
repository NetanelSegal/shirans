# תבנית EmailJS — התראת ליד ממחשבון האומדן

> **הוחל ב-20.9.2026.** התבנית בדשבורד כבר מעודכנת — המסמך נשמר כתיעוד של
> מה שיושב שם ולמה. התבנית `template_nifd3mg` שונתה גם בשמה מ-"Order
> Confirmation" ל-"Calculator Lead Notification", ושדה Reply To הוגדר ל-
> `{{reply_to}}`. המזהה לא השתנה, כך שהקוד ממשיך לעבוד.

> מסמך תפעולי. מיועד להעתקה־הדבקה אל לוח הבקרה של EmailJS. אין צורך בשינוי קוד.

## 1. למה צריך לעדכן את התבנית

שאלות המחשבון הוחלפו. התבנית שיושבת היום ב-EmailJS עדיין מצפה למשתנים של
הגרסה הישנה — `{{built_area}}`, `{{construction_finish}}`, `{{pool}}`,
`{{outdoor_area}}`, `{{outdoor_finish}}`, `{{kitchen}}`, `{{carpentry}}`,
`{{furniture}}`, `{{equipment}}` — והקוד כבר לא שולח אף אחד מהם. EmailJS מחליף
משתנה שלא נשלח במחרוזת ריקה, ולכן כל הבלוק "פרטי הבנייה" מגיע כרשימת תוויות
ללא ערכים:

```
שטח בנוי:  רמת גמר בנייה:  בריכה:  שטח פיתוח חוץ:  ...
```

מה שהשתנה בקוד (`client/src/utils/calculatorLeadEmail.ts`):

- תשע התשובות נשלחות **כמחרוזת אחת** בשם `{{answers}}`, שורה אחת לכל שאלה
  בפורמט `תווית: ערך`. הבחירה מכוונת: הוספת שאלה לאשף לא מחייבת נגיעה בתבנית
  ב-EmailJS. לכן אין לפצל אותה חזרה לשדות נפרדים.
- נוסף `{{lead_url}}` — קישור ישיר שפותח את הפנייה במסך הניהול.
- נוסף `{{marketing_consent}}` — "כן" / "לא".

חשוב לדעת: **הליד תמיד נשמר במסד הנתונים ומופיע במסך הניהול, בין אם המייל
נשלח ובין אם לא.** שליחת ההתראה רצה אחרי השמירה, וכישלון שלה רק נרשם ללוג.
המייל הוא נוחות, לא הרשומה — אף פנייה לא הולכת לאיבוד אם EmailJS נופל.

## 2. איך מעדכנים בלוח הבקרה של EmailJS

1. כניסה ל־<https://dashboard.emailjs.com/> → **Email Templates**.
2. פתיחת התבנית שה-ID שלה מוגדר ב־`VITE_EMAILJS_CALCULATOR_TEMPLATE_ID`
   (משתנה הסביבה של הקליינט — זו תבנית המחשבון, **לא** תבנית טופס יצירת הקשר
   שיושבת תחת `VITE_EMAILJS_TEMPLATE_ID`).
3. בעורך התבנית עוברים ללשונית **Code** / `<>` (עריכת HTML גולמי). בלי המעבר
   הזה העורך הוויזואלי ישבור את הסגנונות המוטבעים.
4. מוחקים את כל תוכן ה-HTML הקיים ומדביקים במקומו את הבלוק מסעיף 3.
5. בשדה **Subject** מדביקים את שורת הנושא מסעיף 5.
6. מוודאים ש**To Email** מכיל את כתובת היעד הקבועה של שירן. הקוד לא שולח
   `to_email`, ולכן הנמען חייב להיות כתוב קשיח בהגדרות התבנית.
7. **Save**, ואז **Test It** — EmailJS יבקש למלא ערכים לכל המשתנים. שווה למלא
   את `{{answers}}` בכמה שורות אמיתיות (ראו הדוגמה בסעיף 4) כדי לוודא שהן
   נשברות לשורות נפרדות.
8. בדיקה אמיתית: מילוי המחשבון באתר מקצה לקצה, וּוידוא שהכפתור "פתיחת הפנייה
   במערכת" נוחת על הליד הנכון.

## 3. ה-HTML המלא להדבקה

```html
<div dir="rtl" style="direction: rtl; text-align: right; margin: 0; padding: 24px 12px; background-color: #F2EDE9; font-family: Arial, 'Segoe UI', system-ui, sans-serif; font-size: 14px; line-height: 1.6; color: #152b44;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="600" style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; background-color: #ffffff; border-radius: 8px;">

    <!-- כותרת -->
    <tr>
      <td dir="rtl" style="direction: rtl; text-align: right; background-color: #152b44; padding: 18px 24px; border-radius: 8px 8px 0 0;">
        <div style="color: #ffffff; font-size: 18px; font-weight: bold;">ליד חדש ממחשבון האומדן</div>
        <div style="color: #F2EDE9; font-size: 13px; padding-top: 4px;">אתר שירן גלעד</div>
      </td>
    </tr>

    <!-- אומדן התקציב -->
    <tr>
      <td dir="rtl" style="direction: rtl; text-align: right; padding: 22px 24px 6px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; border-collapse: collapse; background-color: #F2EDE9; border-radius: 6px;">
          <tr>
            <td dir="rtl" style="direction: rtl; text-align: right; padding: 16px 20px;">
              <div style="font-size: 13px; color: #152b44;">אומדן תקציב</div>
              <div style="padding-top: 6px; font-size: 22px; font-weight: bold; color: #152b44;">
                <span style="direction: ltr; unicode-bidi: isolate; display: inline-block;">{{estimate}}</span>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- כפתור פתיחת הפנייה במערכת -->
    <tr>
      <td dir="rtl" style="direction: rtl; text-align: right; padding: 16px 24px 4px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" bgcolor="#152b44" style="background-color: #152b44; border-radius: 6px;">
              <a href="{{lead_url}}" target="_blank" style="display: block; padding: 13px 24px; font-family: Arial, 'Segoe UI', system-ui, sans-serif; font-size: 15px; font-weight: bold; color: #ffffff; text-decoration: none;">פתיחת הפנייה במערכת</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- פרטי התקשרות -->
    <tr>
      <td dir="rtl" style="direction: rtl; text-align: right; padding: 22px 24px 0 24px;">
        <div style="padding-bottom: 8px; margin-bottom: 10px; border-bottom: 2px solid #152b44; font-size: 14px; font-weight: bold; color: #152b44;">פרטי התקשרות</div>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td dir="rtl" width="90" style="direction: rtl; text-align: right; width: 90px; padding: 6px 0; color: #5a6d7d;">שם</td>
            <td dir="rtl" style="direction: rtl; text-align: right; padding: 6px 0; color: #152b44; font-weight: bold;">{{lead_name}}</td>
          </tr>
          <tr>
            <td dir="rtl" style="direction: rtl; text-align: right; padding: 6px 0; color: #5a6d7d;">טלפון</td>
            <td dir="rtl" style="direction: rtl; text-align: right; padding: 6px 0;">
              <a href="tel:{{lead_phone}}" style="direction: ltr; unicode-bidi: isolate; display: inline-block; color: #152b44; text-decoration: underline;">{{lead_phone}}</a>
            </td>
          </tr>
          <tr>
            <td dir="rtl" style="direction: rtl; text-align: right; padding: 6px 0; color: #5a6d7d;">אימייל</td>
            <td dir="rtl" style="direction: rtl; text-align: right; padding: 6px 0;">
              <a href="mailto:{{lead_email}}" style="direction: ltr; unicode-bidi: isolate; display: inline-block; color: #152b44; text-decoration: underline;">{{lead_email}}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- תשובות האשף -->
    <tr>
      <td dir="rtl" style="direction: rtl; text-align: right; padding: 22px 24px 0 24px;">
        <div style="padding-bottom: 8px; margin-bottom: 10px; border-bottom: 2px solid #152b44; font-size: 14px; font-weight: bold; color: #152b44;">תשובות המחשבון</div>
        <div dir="rtl" style="direction: rtl; text-align: right; white-space: pre-line; padding: 14px 18px; border: 1px solid #E2D9D1; border-radius: 6px; background-color: #ffffff; font-size: 14px; line-height: 1.9; color: #152b44;">{{answers}}</div>
      </td>
    </tr>

    <!-- שוליים -->
    <tr>
      <td dir="rtl" style="direction: rtl; text-align: right; padding: 20px 24px 22px 24px; color: #5a6d7d; font-size: 12px; line-height: 1.9;">
        אישור קבלת דיוור: {{marketing_consent}}<br />
        התקבל בתאריך: <span style="direction: ltr; unicode-bidi: isolate; display: inline-block;">{{created_at}}</span>
      </td>
    </tr>

  </table>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="600" style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse;">
    <tr>
      <td dir="rtl" style="direction: rtl; text-align: right; padding: 12px 4px; color: #5a6d7d; font-size: 12px; line-height: 1.7;">
        הודעה זו נשלחה אוטומטית ממחשבון האומדן באתר שירן גלעד. הפנייה נשמרה
        במערכת גם אם מייל זה לא הגיע.
      </td>
    </tr>
  </table>
</div>
```

### הערות יישום — אל תשנו בלי להבין

- **`white-space: pre-line` ב-`{{answers}}`.** המשתנה הוא מחרוזת אחת עם תווי
  שורה חדשה. HTML מכווץ שורות חדשות לרווח, ובלי `pre-line` כל תשע התשובות
  יידבקו לפסקה אחת. אין להוסיף רווח או ירידת שורה בין `>` ל-`{{answers}}`
  ובין `{{answers}}` ל-`</div>` — תחת `pre-line` הם יהפכו לשורה ריקה מיותרת.
- **בידי ב-`{{estimate}}`.** המחרוזת שהקוד בונה כבר מכילה שני סימני ₪ ומקף
  `–` באמצע (`"7,150,000 ₪ – 8,390,000 ₪"`). בהקשר RTL אלגוריתם הבידי
  מסדר מחדש סימנים ניטרליים כאלה, והתוצאה עלולה להיראות כמו מקף במקום הלא
  נכון או ₪ שקפץ צד. העטיפה ב-`direction: ltr; unicode-bidi: isolate;
  display: inline-block;` מבודדת את המחרוזת מההקשר ומקפיאה אותה בדיוק כפי
  שהקוד בנה אותה. אותה עטיפה מוחלת גם על הטלפון, האימייל והתאריך מאותה סיבה.
- **`dir="rtl"` חוזר על כל תא.** לא מיותר: Gmail מסיר את העטיפה החיצונית
  ומשאיר רק את תוכן ה-`<div>`, ואז הכיווניות של המעטפת נעלמת.
- **סגנונות מוטבעים בלבד.** אין `<style>`, אין flex/grid, פריסה בטבלאות —
  כל השאר נחתך על ידי חלק מלקוחות הדואר.
- **Outlook לדסקטופ (מנוע Word)** לא תומך ב-`white-space: pre-line`. אם שירן
  קוראת דואר שם והשורות נדבקות, אפשר להחליף את ה-`<div>` של התשובות ב-
  `<pre style="...; font-family: Arial, sans-serif; white-space: pre-wrap;">`.
  ב-Gmail, Apple Mail ובוובמייל הישראלי הנפוץ ה-`pre-line` עובד כמו שצריך.

## 4. המשתנים שהקוד שולח

מקור האמת: `client/src/utils/calculatorLeadEmail.ts`. אלה כל המשתנים — כל
`{{...}}` אחר בתבנית ייצא ריק.

| משתנה | מה יש בו | דוגמה |
| --- | --- | --- |
| `lead_url` | קישור מלא שפותח את הליד במסך הניהול | `https://shiran-gilad.com/admin/calculator-leads?lead=abc123` |
| `lead_name` | שם הפונה | `דנה כהן` |
| `lead_email` | אימייל הפונה | `dana@example.com` |
| `lead_phone` | טלפון הפונה, עשר ספרות ללא מקף | `0521234567` |
| `marketing_consent` | אישור דיוור, כמחרוזת עברית | `כן` / `לא` |
| `estimate` | טווח האומדן כמחרוזת מוכנה, כולל ₪ ומקף | `7,150,000 ₪ – 8,390,000 ₪` |
| `answers` | תשע התשובות, מחרוזת אחת, שורה לכל שאלה | ראו למטה |
| `created_at` | חותמת זמן מקומית בפורמט `he-IL` | `20.9.2026, 7:44:24` |

דוגמה מלאה לתוכן `{{answers}}` (התוויות והערכים מגיעים מ-
`shared/src/constants/costCalculatorLabels.ts`, כך שהן זהות למסך הניהול):

```
שלב הפרויקט: יש מגרש
אזור: מרכז
שטח בנוי: 320 מ״ר
קומות: שלוש קומות כולל מרתף
רכיבים נוספים: בריכה, מעלית
רמת גימור: יוקרתית
נגרות: נגרות בהתאמה אישית
עיצוב פנים: מלא
לוח זמנים: בחודשים הקרובים
```

סדר השורות קבוע ותשע השורות תמיד קיימות. כששאלת "רכיבים נוספים" נשארת ריקה
הערך הוא `ללא` ולא שורה חסרה, כך שהבלוק לא משנה גובה בין ליד לליד.

## 5. שורת הנושא (Subject)

```
ליד חדש ממחשבון האומדן: {{lead_name}}
```

בכוונה בלי `{{estimate}}` בנושא: שורת נושא היא טקסט גולמי בלי CSS, ואי אפשר
לבודד שם את ה-₪ והמקף מההקשר העברי — הסכום היה עלול להופיע הפוך או מפורק
בתיבת הדואר. הסכום מופיע בגדול בגוף ההודעה, שם הוא מבודד כמו שצריך.

## 6. פערים ידועים (לא חוסמים)

- **אין `reply_to`.** לחיצה על "השב" בהתראה תשיב לחשבון השולח של EmailJS ולא
  לפונה. אפשר לסדר בשורת קוד אחת בעתיד (הוספת `reply_to: email` למטען).
- **אין `to_email`.** הנמען מוגדר קשיח בשדה To Email של התבנית; שינוי כתובת
  היעד נעשה בלוח הבקרה, לא בקוד.
- **`lead_url` נבנה מ-`window.location.origin`.** מייל שנשלח מסביבת preview
  או מ-localhost יכיל קישור לאותה סביבה, לא לאתר החי. בפרודקשן זה תקין.
- **`created_at` הוא שעון הדפדפן של הפונה**, לא חותמת הזמן שנשמרה בשרת. הפרש
  של שניות בין המייל למסך הניהול הוא צפוי.
- **הקובץ `docs/email-templates/calculator-lead-notification.html` מיושן** —
  זו הגרסה עם המשתנים הישנים. המסמך הזה מחליף אותו; כדאי למחוק או להחליף את
  תוכנו בגרסה שכאן כדי שלא יוטמע בטעות שוב.
