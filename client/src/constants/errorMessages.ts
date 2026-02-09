import { ERROR_KEYS, ErrorKey } from '@shirans/shared';

/**
 * Frontend Error Messages (Hebrew)
 * Uses shared ERROR_KEYS for consistency
 */
export const ERROR_MESSAGES: Record<ErrorKey, string> = {
  [ERROR_KEYS.AUTH.INVALID_CREDENTIALS]: 'אימייל או סיסמה שגויים',
  [ERROR_KEYS.AUTH.TOKEN_REQUIRED]: 'נדרש אימות',
  [ERROR_KEYS.AUTH.TOKEN_INVALID]: 'פג תוקף ההתחברות. אנא התחבר שוב',
  [ERROR_KEYS.AUTH.REFRESH_TOKEN_REQUIRED]: 'נדרש רענון התחברות',
  [ERROR_KEYS.AUTH.REFRESH_TOKEN_INVALID]: 'פג תוקף הרענון. אנא התחבר שוב',
  [ERROR_KEYS.AUTH.AUTHENTICATION_REQUIRED]: 'נדרש אימות לגישה לעמוד זה',
  [ERROR_KEYS.AUTH.ADMIN_ACCESS_REQUIRED]: 'גישת מנהל נדרשת',
  [ERROR_KEYS.AUTH.TOKEN_REUSE_DETECTED]: 'זוהתה בעיית אבטחה. אנא התחבר שוב',

  [ERROR_KEYS.VALIDATION.INVALID_INPUT]: 'נתונים לא תקינים',
  [ERROR_KEYS.VALIDATION.REQUIRED_FIELD]: 'שדה זה חובה',
  [ERROR_KEYS.VALIDATION.INVALID_EMAIL]: 'כתובת אימייל לא תקינה',
  [ERROR_KEYS.VALIDATION.INVALID_PHONE]: 'מספר טלפון לא תקין',
  [ERROR_KEYS.VALIDATION.PASSWORD_TOO_SHORT]:
    'הסיסמה חייבת להכיל לפחות 8 תווים',
  [ERROR_KEYS.VALIDATION.PASSWORD_WEAK]: 'הסיסמה חלשה מדי',
  [ERROR_KEYS.VALIDATION.IMAGES_NOT_BELONG_TO_PROJECT]:
    'תמונות לא שייכות לפרויקט',

  [ERROR_KEYS.NOT_FOUND.USER_NOT_FOUND]: 'משתמש לא נמצא',
  [ERROR_KEYS.NOT_FOUND.PROJECT_NOT_FOUND]: 'פרויקט לא נמצא',
  [ERROR_KEYS.NOT_FOUND.CATEGORY_NOT_FOUND]: 'קטגוריה לא נמצאה',
  [ERROR_KEYS.NOT_FOUND.MAIN_IMAGE_NOT_FOUND]: 'תמונה ראשית לא נמצאה',
  [ERROR_KEYS.NOT_FOUND.PAGE_NOT_FOUND]: 'העמוד המבוקש לא נמצא',
  [ERROR_KEYS.NOT_FOUND.RESOURCE_NOT_FOUND]: 'המשאב המבוקש לא נמצא',

  [ERROR_KEYS.CONFLICT.EMAIL_ALREADY_EXISTS]:
    'כתובת אימייל זו כבר רשומה במערכת',
  [ERROR_KEYS.CONFLICT.PROJECT_TITLE_EXISTS]: 'פרויקט עם שם זה כבר קיים',

  [ERROR_KEYS.NETWORK.CONNECTION_ERROR]:
    'בעיית חיבור. אנא בדוק את החיבור לאינטרנט',
  [ERROR_KEYS.NETWORK.TIMEOUT]: 'הבקשה ארכה זמן רב מדי. אנא נסה שוב',
  [ERROR_KEYS.NETWORK.SERVER_ERROR]: 'שגיאת שרת. אנא נסה שוב מאוחר יותר',
  [ERROR_KEYS.NETWORK.UNKNOWN_ERROR]: 'אירעה שגיאה לא צפויה',

  [ERROR_KEYS.SERVER.REGISTRATION_FAILED]: 'ההרשמה נכשלה. אנא נסה שוב',
  [ERROR_KEYS.SERVER.LOGIN_FAILED]: 'ההתחברות נכשלה. אנא נסה שוב',
  [ERROR_KEYS.SERVER.FETCH_USER_FAILED]: 'לא ניתן לטעון את פרטי המשתמש',
  [ERROR_KEYS.SERVER.REFRESH_TOKEN_FAILED]:
    'רענון ההתחברות נכשל. אנא התחבר שוב',
  [ERROR_KEYS.SERVER.FETCH_PROJECTS_FAILED]: 'לא ניתן לטעון את הפרויקטים',
  [ERROR_KEYS.SERVER.FETCH_FAVOURITE_PROJECTS_FAILED]:
    'לא ניתן לטעון את הפרויקטים המועדפים',
  [ERROR_KEYS.SERVER.CREATE_PROJECT_FAILED]: 'יצירת הפרויקט נכשלה',
  [ERROR_KEYS.SERVER.UPDATE_PROJECT_FAILED]: 'עדכון הפרויקט נכשל',
  [ERROR_KEYS.SERVER.DELETE_PROJECT_FAILED]: 'מחיקת הפרויקט נכשלה',
  [ERROR_KEYS.SERVER.SUBMIT_CONTACT_FAILED]: 'שליחת הטופס נכשלה. אנא נסה שוב',
  [ERROR_KEYS.SERVER.UPLOAD_IMAGES_FAILED]: 'העלאת התמונות נכשלה. אנא נסה שוב',
  [ERROR_KEYS.SERVER.DELETE_MAIN_IMAGE_FAILED]:
    'מחיקת התמונה הראשית נכשלה. אנא נסה שוב',
  [ERROR_KEYS.SERVER.DELETE_PROJECT_IMAGES_FAILED]:
    'מחיקת התמונות של הפרויקט נכשלה. אנא נסה שוב',
} as const;
