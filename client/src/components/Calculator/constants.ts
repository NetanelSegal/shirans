/** Calculator form option labels (Hebrew) — values match shared schema enums */
export const FINISH_OPTIONS = [
  { value: 'standard', label: 'סטנדרט' },
  { value: 'invested', label: 'מושקע' },
  { value: 'premium', label: 'יוקרתי' },
] as const;

export const POOL_OPTIONS = [
  { value: 'none', label: 'ללא' },
  { value: 'small', label: 'קטנה' },
  { value: 'medium', label: 'בינונית' },
  { value: 'large', label: 'גדולה' },
] as const;

export const CARPENTRY_OPTIONS = [
  { value: 'none', label: 'אין' },
  { value: 'ready', label: 'קנייה מוכנה' },
  { value: 'custom', label: 'ייצור לפי הזמנה' },
] as const;

export const FURNITURE_OPTIONS = [
  { value: 'none', label: 'אין' },
  { value: 'basic', label: 'בסיסי' },
  { value: 'full', label: 'מלא' },
] as const;
