import {
  CalendarClock,
  CalendarDays,
  CalendarRange,
  Clock,
  Compass,
  FileText,
  MapPin,
  Search,
} from 'lucide-react';
import type { StepDefinition } from './types';

import regionNorth from '@/assets/calculator/region-north.webp';
import regionCenter from '@/assets/calculator/region-center.webp';
import regionSouth from '@/assets/calculator/region-south.webp';
import levelsOne from '@/assets/calculator/levels-one.webp';
import levelsTwo from '@/assets/calculator/levels-two.webp';
import levelsThreeBasement from '@/assets/calculator/levels-three-basement.webp';
import componentPool from '@/assets/calculator/component-pool.webp';
import componentElevator from '@/assets/calculator/component-elevator.webp';
import componentDecorativePool from '@/assets/calculator/component-decorative-pool.webp';
import componentLargeOpenings from '@/assets/calculator/component-large-openings.webp';
import componentLandscaping from '@/assets/calculator/component-landscaping.webp';
import finishStandard from '@/assets/calculator/finish-standard.webp';
import finishHigh from '@/assets/calculator/finish-high.webp';
import finishPremium from '@/assets/calculator/finish-premium.webp';
import carpentryReady from '@/assets/calculator/carpentry-ready.webp';
import carpentryCustom from '@/assets/calculator/carpentry-custom.webp';
import interiorNone from '@/assets/calculator/interior-none.webp';
import interiorPartial from '@/assets/calculator/interior-partial.webp';
import interiorFull from '@/assets/calculator/interior-full.webp';

/**
 * The wizard's content, in order. Steps are data rather than components so the
 * copy, options and images live in one reviewable place, and each step component
 * stays generic (one renderer per *kind*, not per question).
 */
export const COST_CALCULATOR_STEPS: StepDefinition[] = [
  {
    kind: 'single',
    id: 'projectStage',
    layout: 'icon-grid',
    title: 'איפה אתם נמצאים היום בתהליך?',
    subtitle: 'זה עוזר לנו להבין את נקודת הפתיחה שלכם.',
    options: [
      { value: 'has_plot', label: 'יש לנו מגרש', icon: MapPin },
      { value: 'buying_plot', label: 'אנחנו בתהליך רכישת מגרש', icon: FileText },
      { value: 'searching_plot', label: 'אנחנו מחפשים מגרש', icon: Search },
      { value: 'exploring', label: 'רק מתחילים לבדוק את האפשרויות', icon: Compass },
    ],
  },
  {
    kind: 'single',
    id: 'region',
    layout: 'image-grid',
    title: 'באיזה אזור אתם מתכננים לבנות?',
    subtitle: 'האזור משפיע על עלויות הבנייה, הפיתוח וההיתרים.',
    options: [
      { value: 'north', label: 'צפון', image: regionNorth },
      { value: 'center', label: 'מרכז', image: regionCenter },
      { value: 'south', label: 'דרום', image: regionSouth },
    ],
  },
  {
    kind: 'area',
    id: 'builtAreaSqm',
    title: 'מה גודל הבית שאתם מתכננים?',
    subtitle: 'הכניסו את שטח הבית המבוקש במטרים רבועים (מ״ר).',
    hint: 'לא בטוחים? ניתן להזין הערכה משוערת — המטרה היא לקבל סדר גודל נכון.',
  },
  {
    kind: 'single',
    id: 'levels',
    layout: 'row-list',
    title: 'כמה מפלסים יהיו בבית?',
    subtitle: 'בחרו את האפשרות המתאימה לתכנון שלכם.',
    options: [
      {
        value: 'three_with_basement',
        label: '3 קומות',
        sublabel: 'מרתף ושתיים מעל הקרקע',
        image: levelsThreeBasement,
      },
      { value: 'two', label: '2 קומות', sublabel: 'מעל הקרקע', image: levelsTwo },
      { value: 'one', label: 'קומה אחת', sublabel: 'מעל הקרקע', image: levelsOne },
    ],
  },
  {
    kind: 'multi',
    id: 'components',
    title: 'אילו מרכיבים תרצו בבית?',
    subtitle: 'אפשר לבחור יותר מאפשרות אחת.',
    options: [
      { value: 'pool', label: 'בריכה', image: componentPool },
      { value: 'elevator', label: 'מעלית', image: componentElevator },
      { value: 'decorative_pool', label: 'בריכת נוי', image: componentDecorativePool },
      { value: 'large_openings', label: 'מפתחים גדולים', image: componentLargeOpenings },
      { value: 'landscaping', label: 'פיתוח חוץ מושקע מאוד', image: componentLandscaping },
    ],
  },
  {
    kind: 'single',
    id: 'finishLevel',
    layout: 'image-grid',
    title: 'איזו רמת גמר אתם מדמיינים?',
    subtitle: 'רמת הגמר משפיעה על העלות הכוללת.',
    options: [
      { value: 'standard', label: 'סטנדרט', sublabel: 'איכותי ומדויק', image: finishStandard },
      { value: 'high', label: 'גבוהה', sublabel: 'מפרט משודרג', image: finishHigh },
      { value: 'premium', label: 'פרימיום', sublabel: 'חומרים בהתאמה אישית', image: finishPremium },
    ],
  },
  {
    kind: 'single',
    id: 'carpentry',
    layout: 'image-grid',
    title: 'איזו נגרות תרצו בבית?',
    subtitle: 'הנגרות היא חלק משמעותי מהאופי ומהעלויות.',
    options: [
      { value: 'ready', label: 'נגרות מוכנה', sublabel: 'סטנדרטית', image: carpentryReady },
      { value: 'custom', label: 'נגרות בהתאמה אישית', image: carpentryCustom },
    ],
  },
  {
    kind: 'single',
    id: 'interiorDesign',
    layout: 'image-grid',
    title: 'איזה היקף עיצוב פנים תרצו?',
    subtitle: 'עיצוב פנים משפיע על התקציב ומאפשר לתכנן בית מדויק לצרכים שלכם.',
    options: [
      { value: 'none', label: 'ללא עיצוב פנים', image: interiorNone },
      { value: 'partial', label: 'עיצוב חלקי', sublabel: 'ייעוץ ותכנון נבחרים', image: interiorPartial },
      { value: 'full', label: 'עיצוב פנים מלא', sublabel: 'תכנון וליווי מלא', image: interiorFull },
    ],
  },
  {
    kind: 'single',
    id: 'timeline',
    layout: 'icon-grid',
    title: 'מתי תרצו להתחיל את התכנון?',
    options: [
      { value: 'coming_months', label: 'בחודשים הקרובים', icon: CalendarDays },
      { value: '3_6_months', label: 'בעוד 3-6 חודשים', icon: CalendarRange },
      { value: '6_12_months', label: 'בעוד 6-12 חודשים', icon: CalendarClock },
      { value: 'over_year', label: 'יותר משנה', icon: Clock },
    ],
  },
  {
    kind: 'contact',
    id: 'contact',
    title: 'לאן לשלוח את ההערכה?',
    subtitle:
      'השאירו פרטים וקבלו מיד את ההערכה הראשונית שלכם. לאחר מכן נוכל ליצור איתכם קשר ולענות על שאלות.',
  },
];

export const TOTAL_STEPS = COST_CALCULATOR_STEPS.length;
