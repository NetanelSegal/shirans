import type {
  CalculatorFormInput,
  CalculatorConfigInput,
} from '../schemas/calculator.schema';

export const DEFAULT_CALCULATOR_CONFIG: CalculatorConfigInput = {
  constructionBase: { min: 8000, max: 12000 },
  outdoorBase: { min: 500, max: 1500 },
  finishMultipliers: {
    standard: { min: 1, max: 1.1 },
    invested: { min: 1.2, max: 1.4 },
    premium: { min: 1.5, max: 1.8 },
  },
  poolAddons: {
    none: { min: 0, max: 0 },
    small: { min: 120000, max: 180000 },
    medium: { min: 200000, max: 300000 },
    large: { min: 350000, max: 450000 },
  },
  kitchenAddons: {
    standard: { min: 80000, max: 120000 },
    invested: { min: 150000, max: 220000 },
    premium: { min: 250000, max: 350000 },
  },
  carpentryAddons: {
    none: { min: 0, max: 0 },
    ready: { min: 30000, max: 60000 },
    custom: { min: 80000, max: 150000 },
  },
  furnitureAddons: {
    none: { min: 0, max: 0 },
    basic: { min: 50000, max: 100000 },
    full: { min: 150000, max: 300000 },
  },
  equipmentAddons: {
    none: { min: 0, max: 0 },
    basic: { min: 30000, max: 60000 },
    full: { min: 80000, max: 150000 },
  },
  vatMultiplier: 1.18,
};

export function calculateEstimate(
  input: CalculatorFormInput,
  config: CalculatorConfigInput,
): number {
  const finish = config.finishMultipliers[input.constructionFinish];
  const outdoorFinish = config.finishMultipliers[input.outdoorFinish];

  const constructionMin =
    input.builtAreaSqm * config.constructionBase.min * finish.min;
  const constructionMax =
    input.builtAreaSqm * config.constructionBase.max * finish.max;

  const outdoorMin =
    input.outdoorAreaSqm * config.outdoorBase.min * outdoorFinish.min;
  const outdoorMax =
    input.outdoorAreaSqm * config.outdoorBase.max * outdoorFinish.max;

  const pool = config.poolAddons[input.pool];
  const kitchen = config.kitchenAddons[input.kitchen];
  const carpentry = config.carpentryAddons[input.carpentry];
  const furniture = config.furnitureAddons[input.furniture];
  const equipment = config.equipmentAddons[input.equipment];

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

  return Math.round((totalMin + totalMax) / 2);
}

/** Format a number as Hebrew locale price (e.g. 1,234,567) */
export function formatPrice(n: number): string {
  return new Intl.NumberFormat('he-IL').format(n);
}

/** Get single display estimate from lead (handles legacy min/max or new single value) */
export function getLeadDisplayEstimate(lead: {
  estimateMin: number;
  estimateMax: number;
}): number {
  return Math.round((lead.estimateMin + lead.estimateMax) / 2);
}
