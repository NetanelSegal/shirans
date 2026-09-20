import {
  CARPENTRY_LABELS,
  COMPONENT_LABELS,
  FINISH_LEVEL_LABELS,
  INTERIOR_DESIGN_LABELS,
  LEVELS_LABELS,
  REGION_LABELS,
} from '@shirans/shared';

export interface ConfigField {
  /** Dot path into the config object. */
  path: string;
  label: string;
  /** Multipliers need decimals; shekel amounts do not. */
  step?: number;
  suffix?: string;
}

export interface ConfigGroup {
  title: string;
  description?: string;
  fields: ConfigField[];
}

const multiplier = (path: string, label: string): ConfigField => ({
  path,
  label,
  step: 0.01,
  suffix: '×',
});

const shekels = (path: string, label: string): ConfigField => ({
  path,
  label,
  suffix: '₪',
});

/**
 * The config form as data rather than as markup.
 *
 * There are two dozen numbers here and they all behave identically — a labelled
 * number input bound to a path. Writing each one out by hand makes the screen
 * long, makes adding a question a copy-paste exercise, and makes it easy for one
 * field to quietly disagree with the rest.
 */
export const COST_CALCULATOR_CONFIG_GROUPS: ConfigGroup[] = [
  {
    title: 'בסיס החישוב',
    description: 'נקודת המוצא: מחיר למ״ר מוכפל בשטח הבנוי, לפני כל שאר המקדמים.',
    fields: [
      shekels('baseRatePerSqm', 'מחיר בסיס למ״ר'),
      { path: 'builtAreaSqmRange.min', label: 'שטח בנוי מינימלי', suffix: 'מ״ר' },
      { path: 'builtAreaSqmRange.max', label: 'שטח בנוי מקסימלי', suffix: 'מ״ר' },
    ],
  },
  {
    title: 'מקדם אזור',
    description: '1.00 = מחיר הבסיס. 1.15 = יקר ב-15%.',
    fields: [
      multiplier('regionMultipliers.north', REGION_LABELS.north),
      multiplier('regionMultipliers.center', REGION_LABELS.center),
      multiplier('regionMultipliers.south', REGION_LABELS.south),
    ],
  },
  {
    title: 'מקדם קומות',
    fields: [
      multiplier('levelsMultipliers.one', LEVELS_LABELS.one),
      multiplier('levelsMultipliers.two', LEVELS_LABELS.two),
      multiplier(
        'levelsMultipliers.three_with_basement',
        LEVELS_LABELS.three_with_basement,
      ),
    ],
  },
  {
    title: 'מקדם רמת גימור',
    fields: [
      multiplier('finishMultipliers.standard', FINISH_LEVEL_LABELS.standard),
      multiplier('finishMultipliers.high', FINISH_LEVEL_LABELS.high),
      multiplier('finishMultipliers.premium', FINISH_LEVEL_LABELS.premium),
    ],
  },
  {
    title: 'תוספת נגרות',
    description: 'סכום קבוע שמתווסף בסוף החישוב, לא מקדם.',
    fields: [
      shekels('carpentryAddons.ready', CARPENTRY_LABELS.ready),
      shekels('carpentryAddons.custom', CARPENTRY_LABELS.custom),
    ],
  },
  {
    title: 'תוספת עיצוב פנים',
    fields: [
      shekels('interiorDesignAddons.none', INTERIOR_DESIGN_LABELS.none),
      shekels('interiorDesignAddons.partial', INTERIOR_DESIGN_LABELS.partial),
      shekels('interiorDesignAddons.full', INTERIOR_DESIGN_LABELS.full),
    ],
  },
  {
    title: 'תוספת רכיבים',
    description: 'נבחרים כמה שרוצים, והסכומים מצטברים.',
    fields: [
      shekels('componentAddons.pool', COMPONENT_LABELS.pool),
      shekels('componentAddons.elevator', COMPONENT_LABELS.elevator),
      shekels('componentAddons.decorative_pool', COMPONENT_LABELS.decorative_pool),
      shekels('componentAddons.large_openings', COMPONENT_LABELS.large_openings),
      shekels('componentAddons.landscaping', COMPONENT_LABELS.landscaping),
    ],
  },
  {
    title: 'הצגת התוצאה',
    description:
      'רוחב הטווח מיושם פעם אחת בסוף. 0.08 = ±8% סביב התוצאה. האומדן שמוצג הוא לפני מע״מ.',
    // No field for `vatMultiplier`: it is stored for reference and read by
    // nothing, and an editable control invites changing a number that has no
    // effect on any estimate.
    fields: [{ path: 'rangeSpread', label: 'רוחב הטווח', step: 0.01 }],
  },
];
