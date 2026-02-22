import type { CalculatorFormInput } from '../schemas/calculator.schema';

const VAT_MULTIPLIER = 1.18;

// Base rates per sqm (ILS) - min/max for range
const CONSTRUCTION_BASE = { min: 8000, max: 12000 };
const OUTDOOR_BASE = { min: 500, max: 1500 };

// Finish level multipliers (standard=1, invested=1.3, premium=1.6)
const FINISH_MULTIPLIERS = {
  standard: { min: 1, max: 1.1 },
  invested: { min: 1.2, max: 1.4 },
  premium: { min: 1.5, max: 1.8 },
} as const;

// Pool add-ons (ILS)
const POOL_ADDONS = {
  none: { min: 0, max: 0 },
  small: { min: 120000, max: 180000 },
  medium: { min: 200000, max: 300000 },
  large: { min: 350000, max: 450000 },
} as const;

// Kitchen add-ons (ILS)
const KITCHEN_ADDONS = {
  standard: { min: 80000, max: 120000 },
  invested: { min: 150000, max: 220000 },
  premium: { min: 250000, max: 350000 },
} as const;

// Carpentry add-ons (ILS)
const CARPENTRY_ADDONS = {
  none: { min: 0, max: 0 },
  ready: { min: 30000, max: 60000 },
  custom: { min: 80000, max: 150000 },
} as const;

// Furniture add-ons (ILS)
const FURNITURE_ADDONS = {
  none: { min: 0, max: 0 },
  basic: { min: 50000, max: 100000 },
  full: { min: 150000, max: 300000 },
} as const;

// Equipment add-ons (ILS)
const EQUIPMENT_ADDONS = {
  none: { min: 0, max: 0 },
  basic: { min: 30000, max: 60000 },
  full: { min: 80000, max: 150000 },
} as const;

export function calculateEstimate(input: CalculatorFormInput): { min: number; max: number } {
  const finish = FINISH_MULTIPLIERS[input.constructionFinish];
  const outdoorFinish = FINISH_MULTIPLIERS[input.outdoorFinish];

  // Construction (main building)
  const constructionMin =
    input.builtAreaSqm * CONSTRUCTION_BASE.min * finish.min;
  const constructionMax =
    input.builtAreaSqm * CONSTRUCTION_BASE.max * finish.max;

  // Outdoor development
  const outdoorMin =
    input.outdoorAreaSqm * OUTDOOR_BASE.min * outdoorFinish.min;
  const outdoorMax =
    input.outdoorAreaSqm * OUTDOOR_BASE.max * outdoorFinish.max;

  // Add-ons
  const pool = POOL_ADDONS[input.pool];
  const kitchen = KITCHEN_ADDONS[input.kitchen];
  const carpentry = CARPENTRY_ADDONS[input.carpentry];
  const furniture = FURNITURE_ADDONS[input.furniture];
  const equipment = EQUIPMENT_ADDONS[input.equipment];

  let totalMin =
    constructionMin +
    outdoorMin +
    pool.min +
    kitchen.min +
    carpentry.min +
    furniture.min +
    equipment.min;
  let totalMax =
    constructionMax +
    outdoorMax +
    pool.max +
    kitchen.max +
    carpentry.max +
    furniture.max +
    equipment.max;

  if (input.priceDisplay === 'including_vat') {
    totalMin *= VAT_MULTIPLIER;
    totalMax *= VAT_MULTIPLIER;
  }

  return {
    min: Math.round(totalMin),
    max: Math.round(totalMax),
  };
}

export const WHATSAPP_NUMBER = '97252174443';
export const WHATSAPP_MESSAGE =
  'היי שירן,\nביצעתי חישוב במחשבון אומדן עלות לבנייה פרטית\nואשמח לקבוע פגישת היכרות';
