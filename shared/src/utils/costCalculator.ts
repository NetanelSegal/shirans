import type {
  CostCalculatorAnswers,
  CostCalculatorConfig,
} from '../schemas/costCalculator.schema';

/**
 * Starting points, tuned to land a mid-range house in the right ballpark
 * (250 m² in the centre, one level, standard finish ≈ 2.7M–3.2M ₪ pre-VAT).
 * Shiran adjusts all of these from the admin screen; nothing here is load-bearing
 * beyond being a sane day-one default.
 */
export const DEFAULT_COST_CALCULATOR_CONFIG: CostCalculatorConfig = {
  builtAreaSqmRange: { min: 100, max: 500 },
  baseRatePerSqm: 10_000,
  regionMultipliers: {
    north: 1.0,
    center: 1.15,
    south: 0.95,
  },
  levelsMultipliers: {
    one: 1.0,
    two: 1.05,
    three_with_basement: 1.15,
  },
  finishMultipliers: {
    standard: 1.0,
    high: 1.3,
    premium: 1.65,
  },
  carpentryAddons: {
    ready: 45_000,
    custom: 115_000,
  },
  interiorDesignAddons: {
    none: 0,
    partial: 75_000,
    full: 225_000,
  },
  componentAddons: {
    pool: 250_000,
    elevator: 200_000,
    decorative_pool: 45_000,
    large_openings: 115_000,
    landscaping: 225_000,
    other: 0,
  },
  vatMultiplier: 1.18,
};

/**
 * Round to the nearest 10k.
 *
 * This is the only thing left signalling that the figure is an estimate rather
 * than a quote, now that the result is a single number instead of a range — so
 * it matters more than it looks. A figure like 4,017,350 reads as something
 * that was priced; 4,020,000 reads as something that was assessed.
 */
function roundToNearest(value: number, step = 10_000): number {
  return Math.round(value / step) * step;
}

/**
 * Area × rate, scaled by the multiplier questions, plus the flat add-ons.
 * Pre-VAT.
 */
export function calculateCost(
  answers: CostCalculatorAnswers,
  config: CostCalculatorConfig,
): number {
  const base = answers.builtAreaSqm * config.baseRatePerSqm;

  const scaled =
    base *
    config.regionMultipliers[answers.region] *
    config.levelsMultipliers[answers.levels] *
    config.finishMultipliers[answers.finishLevel];

  const addons =
    config.carpentryAddons[answers.carpentry] +
    config.interiorDesignAddons[answers.interiorDesign] +
    answers.components.reduce(
      (sum, component) => sum + config.componentAddons[component],
      0,
    );

  return roundToNearest(scaled + addons);
}

/** e.g. 3200000 -> "3,200,000" */
export function formatShekels(value: number): string {
  return new Intl.NumberFormat('he-IL').format(value);
}
