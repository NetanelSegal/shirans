import { ErrorKey, formatErrorMessage } from '@shirans/shared';

/**
 * Frontend Error Messages (Hebrew)
 * Uses shared ERROR_KEYS for consistency
 */
export const ERROR_MESSAGES = {
  'NETWORK.CONNECTION_ERROR': 'שגיאת חיבור',
  'NETWORK.TIMEOUT': 'זמן חילוף חסר',
  'NETWORK.SERVER_ERROR': 'שגיאת שרת',
  'NETWORK.UNKNOWN_ERROR': 'שגיאה לא ידועה',

  'AUTH.ADMIN_ACCESS_REQUIRED': 'כניסה נדרשת לאיזור ניהול',
  'AUTH.AUTHENTICATION_REQUIRED': 'כניסה נדרשת',
  'AUTH.INVALID_CREDENTIALS': 'אימות נדרש',
  'AUTH.REFRESH_TOKEN_INVALID': 'טוקן רענון שגוי',
  'AUTH.REFRESH_TOKEN_REQUIRED': 'טוקן רענון נדרש',
  'AUTH.TOKEN_INVALID': 'טוקן שגוי',
  'AUTH.TOKEN_REQUIRED': 'טוקן נדרש',
  'AUTH.TOKEN_REUSE_DETECTED': 'טוקן כבר נעשה שימוש',

  'VALIDATION.INVALID_INPUT': 'נתונים שגויים',
  'VALIDATION.REQUIRED_FIELD': 'שדה נדרש',
  'VALIDATION.INVALID_EMAIL': 'כתובת דואר אלקטרוני שגויה',
  'VALIDATION.INVALID_PHONE': 'טלפון שגוי',
  'VALIDATION.PASSWORD_TOO_SHORT': 'סיסמה חלשה מדי',
  'VALIDATION.PASSWORD_WEAK': 'סיסמה חלשה',
  'VALIDATION.IMAGES_NOT_BELONG_TO_PROJECT': 'תמונות לא שייכות לפרוייקט',

  'NOT_FOUND.USER_NOT_FOUND': 'משתמש לא נמצא',
  'NOT_FOUND.PROJECT_NOT_FOUND': 'פרוייקט לא נמצא',
  'NOT_FOUND.CATEGORY_NOT_FOUND': 'קטגוריה לא נמצא',
  'NOT_FOUND.MAIN_IMAGE_NOT_FOUND': 'תמונת מוצא לא נמצאת',
  'NOT_FOUND.PAGE_NOT_FOUND': 'דף לא נמצא',
  'NOT_FOUND.RESOURCE_NOT_FOUND': 'משאב לא נמצא',
  'NOT_FOUND.TESTIMONIAL_NOT_FOUND': 'צפייה במשוב לא נמצאה',

  'CONFLICT.EMAIL_ALREADY_EXISTS': 'כתובת דואר אלקטרוני כבר קיימת',
  'CONFLICT.PROJECT_TITLE_EXISTS': 'כותרת פרוייקט כבר קיימת',

  'SERVER.USER.LOGIN_FAILED': 'כניסה לא נכשלה',
  'SERVER.USER.FETCH_USER_FAILED': 'קביעת משתמש נכשלה',
  'SERVER.USER.REFRESH_TOKEN_FAILED': 'רענון טוקן נכשל',
  'SERVER.USER.REGISTRATION_FAILED': 'הרשמה נכשלה',

  'SERVER.CONTACT.SUBMIT_FAILED': 'שליחת הודעה נכשלה',
  'SERVER.CONTACT.FETCH_SUBMISSIONS_FAILED': 'קביעת משתמש נכשלה',
  'SERVER.CONTACT.FETCH_SUBMISSION_BY_ID_FAILED': 'רענון טוקן נכשל',
  'SERVER.CONTACT.UPDATE_SUBMISSION_FAILED': 'שגיאת חיבור',
  'SERVER.CONTACT.DELETE_SUBMISSION_FAILED': 'זמן חילוף חסר',

  'SERVER.PROJECT.CREATE_FAILED': 'שגיאת שרת',
  'SERVER.PROJECT.UPDATE_FAILED': 'שגיאה לא ידועה',
  'SERVER.PROJECT.DELETE_FAILED': 'שגיאת שרת',
  'SERVER.PROJECT.FETCHS_FAILED': 'שגיאת שרת',
  'SERVER.PROJECT.FETCH_FAVOURITES_FAILED': 'שגיאת שרת',
  'SERVER.PROJECT.FETCH_BY_ID_FAILED': 'שגיאת שרת',

  'SERVER.TESTIMONIAL.CREATE_FAILED': 'שגיאת שרת',
  'SERVER.TESTIMONIAL.UPDATE_FAILED': 'שגיאת שרת',
  'SERVER.TESTIMONIAL.DELETE_FAILED': 'שגיאת שרת',
  'SERVER.TESTIMONIAL.FETCHS_FAILED': 'שגיאת שרת',
  'SERVER.TESTIMONIAL.FETCH_BY_ID_FAILED': 'שגיאת שרת',
} as const satisfies Record<ErrorKey, string>;

export type ErrorMessage = (typeof ERROR_MESSAGES)[ErrorKey];

export function getClientErrorMessage(key: ErrorKey): ErrorMessage {
  return formatErrorMessage(ERROR_MESSAGES, key);
}
