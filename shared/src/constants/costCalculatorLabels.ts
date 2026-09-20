import type {
  CalculatorComponent,
  Carpentry,
  FinishLevel,
  InteriorDesign,
  Levels,
  ProjectStage,
  Region,
  Timeline,
} from '../schemas/costCalculator.schema';

/**
 * The Hebrew each stored answer is shown as.
 *
 * Here rather than in the client because the admin table, the lead detail view
 * and the notification email all need the same words, and a value that reads
 * "premium" in one place and "יוקרתי" in another is a support call waiting to
 * happen. The wizard's own option labels stay with the wizard — those are
 * marketing copy and are free to differ.
 */

export const PROJECT_STAGE_LABELS: Record<ProjectStage, string> = {
  has_plot: 'יש מגרש',
  buying_plot: 'בתהליך רכישת מגרש',
  searching_plot: 'מחפשים מגרש',
  exploring: 'בודקים אפשרויות',
};

export const REGION_LABELS: Record<Region, string> = {
  north: 'צפון',
  center: 'מרכז',
  south: 'דרום',
};

export const LEVELS_LABELS: Record<Levels, string> = {
  one: 'קומה אחת',
  two: 'שתי קומות',
  three_with_basement: 'שלוש קומות כולל מרתף',
};

export const COMPONENT_LABELS: Record<CalculatorComponent, string> = {
  pool: 'בריכה',
  elevator: 'מעלית',
  decorative_pool: 'בריכת נוי',
  large_openings: 'פתחים גדולים',
  landscaping: 'פיתוח ונוף',
  other: 'אחר',
};

export const FINISH_LEVEL_LABELS: Record<FinishLevel, string> = {
  standard: 'סטנדרט',
  high: 'גבוהה',
  premium: 'יוקרתית',
};

export const CARPENTRY_LABELS: Record<Carpentry, string> = {
  ready: 'נגרות מוכנה',
  custom: 'נגרות בהתאמה אישית',
};

export const INTERIOR_DESIGN_LABELS: Record<InteriorDesign, string> = {
  none: 'ללא',
  partial: 'חלקי',
  full: 'מלא',
};

export const TIMELINE_LABELS: Record<Timeline, string> = {
  coming_months: 'בחודשים הקרובים',
  '3_6_months': 'בעוד 3-6 חודשים',
  '6_12_months': 'בעוד 6-12 חודשים',
  over_year: 'בעוד שנה ומעלה',
};

/** Field-by-field label for the question itself, for tables and emails. */
export const ANSWER_FIELD_LABELS = {
  projectStage: 'שלב הפרויקט',
  region: 'אזור',
  builtAreaSqm: 'שטח בנוי',
  levels: 'קומות',
  components: 'רכיבים נוספים',
  finishLevel: 'רמת גימור',
  carpentry: 'נגרות',
  interiorDesign: 'עיצוב פנים',
  timeline: 'לוח זמנים',
} as const;
