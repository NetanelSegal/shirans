import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

/**
 * Cost calculator (wizard) — the 10-step flow from the design.
 *
 * Option values are the single source of truth for the whole feature: the client
 * derives its asset filenames from them (`region-tel-aviv-center.webp`), the
 * pricing config is keyed by them, and the DB stores them verbatim. Renaming one
 * is therefore a deliberate, greppable change rather than something that can
 * drift between layers.
 */

export const PROJECT_STAGES = [
  'has_plot',
  'buying_plot',
  'searching_plot',
  'exploring',
] as const;

export const REGIONS = ['north', 'center', 'south'] as const;

export const LEVELS = ['one', 'two', 'three_with_basement'] as const;

export const COMPONENTS = [
  'pool',
  'elevator',
  'decorative_pool',
  'large_openings',
  'landscaping',
  /**
   * No longer offered by the wizard, and deliberately still here: leads
   * submitted before it was withdrawn hold this value, and dropping it from the
   * enum would leave those rows unreadable in the admin. Removing it for good
   * means migrating those rows first.
   */
  'other',
] as const;

export const FINISH_LEVELS = ['standard', 'high', 'premium'] as const;

export const CARPENTRY_OPTIONS = ['ready', 'custom'] as const;

export const INTERIOR_DESIGN_OPTIONS = ['none', 'partial', 'full'] as const;

export const TIMELINES = [
  'coming_months',
  '3_6_months',
  '6_12_months',
  'over_year',
] as const;

export const projectStageSchema = z.enum(PROJECT_STAGES);
export const regionSchema = z.enum(REGIONS);
export const levelsSchema = z.enum(LEVELS);
export const componentSchema = z.enum(COMPONENTS);
export const finishLevelSchema = z.enum(FINISH_LEVELS);
export const carpentrySchema = z.enum(CARPENTRY_OPTIONS);
export const interiorDesignSchema = z.enum(INTERIOR_DESIGN_OPTIONS);
export const timelineSchema = z.enum(TIMELINES);

export type ProjectStage = z.infer<typeof projectStageSchema>;
export type Region = z.infer<typeof regionSchema>;
export type Levels = z.infer<typeof levelsSchema>;
export type CalculatorComponent = z.infer<typeof componentSchema>;
export type FinishLevel = z.infer<typeof finishLevelSchema>;
export type Carpentry = z.infer<typeof carpentrySchema>;
export type InteriorDesign = z.infer<typeof interiorDesignSchema>;
export type Timeline = z.infer<typeof timelineSchema>;

/** The wizard's answers — everything asked before the contact step. */
export const costCalculatorAnswersSchema = z.object({
  projectStage: projectStageSchema,
  region: regionSchema,
  builtAreaSqm: z.number().int().min(1),
  levels: levelsSchema,
  /** Multi-select; may legitimately be empty (none of the extras). */
  components: z.array(componentSchema),
  finishLevel: finishLevelSchema,
  carpentry: carpentrySchema,
  interiorDesign: interiorDesignSchema,
  timeline: timelineSchema,
});

export type CostCalculatorAnswers = z.infer<typeof costCalculatorAnswersSchema>;

/** Contact step — the only PII the wizard collects. */
export const costCalculatorContactSchema = z.object({
  name: z
    .string()
    .min(2, 'שם חייב להכיל לפחות 2 תווים')
    .max(50, 'שם חייב להכיל פחות מ-50 תווים')
    .transform((val) => DOMPurify.sanitize(val.trim())),
  phoneNumber: z
    .string()
    .length(10, 'מספר טלפון חייב להכיל בדיוק 10 ספרות')
    .regex(/^\d+$/, 'מספר טלפון חייב להכיל ספרות בלבד')
    .transform((val) => DOMPurify.sanitize(val.trim())),
  email: z
    .email('כתובת אימייל לא תקינה')
    .max(50, 'אימייל חייב להכיל פחות מ-50 תווים')
    .transform((val) => DOMPurify.sanitize(val.trim())),
  /** Explicit rather than defaulted — a consent flag should never be implied. */
  marketingConsent: z.boolean(),
});

export type CostCalculatorContact = z.infer<typeof costCalculatorContactSchema>;

const multiplier = z.number().positive();
const shekels = z.number().nonnegative();

/**
 * Admin-editable pricing config.
 *
 * One number per factor, and one number out. The result used to be a range
 * produced by widening the total at the end; Shiran asked for a single figure,
 * so the widening — and the setting behind it — are gone rather than left
 * sitting in the config doing nothing.
 */
export const costCalculatorConfigSchema = z.object({
  /**
   * Refined rather than left to the two fields: a min above the max saves
   * cleanly, then clamps every entered area to the wrong end and makes the
   * server reject every submission with nothing in the admin explaining why.
   */
  builtAreaSqmRange: z
    .object({ min: z.number().int().min(1), max: z.number().int().min(1) })
    .refine((range) => range.min <= range.max, {
      message: 'שטח מינימלי חייב להיות קטן או שווה לשטח המקסימלי',
    }),
  baseRatePerSqm: shekels,
  regionMultipliers: z.object({
    north: multiplier,
    center: multiplier,
    south: multiplier,
  }),
  levelsMultipliers: z.object({
    one: multiplier,
    two: multiplier,
    three_with_basement: multiplier,
  }),
  finishMultipliers: z.object({
    standard: multiplier,
    high: multiplier,
    premium: multiplier,
  }),
  carpentryAddons: z.object({ ready: shekels, custom: shekels }),
  interiorDesignAddons: z.object({
    none: shekels,
    partial: shekels,
    full: shekels,
  }),
  componentAddons: z.object({
    pool: shekels,
    elevator: shekels,
    decorative_pool: shekels,
    large_openings: shekels,
    landscaping: shekels,
    other: shekels,
  }),
  /** Kept for reference; the displayed estimate is pre-VAT. */
  vatMultiplier: multiplier,
});

export type CostCalculatorConfig = z.infer<typeof costCalculatorConfigSchema>;

/**
 * What the wizard posts: the answers plus the contact details.
 *
 * Deliberately no estimate. The number is recomputed on the server from the
 * stored config, so a lead in the database always reflects the rates Shiran
 * actually set — not whatever a client chose to send.
 */
export const submitCostCalculatorLeadSchema = costCalculatorAnswersSchema
  .extend(costCalculatorContactSchema.shape)
  .strict();

export type SubmitCostCalculatorLeadInput = z.input<
  typeof submitCostCalculatorLeadSchema
>;

/** A stored lead, as the admin screens read it. */
export interface CostCalculatorLeadResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  marketingConsent: boolean;
  projectStage: ProjectStage;
  region: Region;
  builtAreaSqm: number;
  levels: Levels;
  components: CalculatorComponent[];
  finishLevel: FinishLevel;
  carpentry: Carpentry;
  interiorDesign: InteriorDesign;
  timeline: Timeline;
  estimate: number;
  isRead: boolean;
  createdAt: string;
}

export const costCalculatorLeadsQuerySchema = z.object({
  isRead: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
});

export const costCalculatorLeadIdSchema = z.object({
  id: z.cuid('Lead ID must be a valid CUID'),
});

export const costCalculatorUpdateReadSchema = z.object({
  isRead: z.boolean(),
});

export const costCalculatorBulkIdsSchema = z.object({
  ids: z
    .array(z.cuid('Lead ID must be a valid CUID'))
    .min(1, 'At least one ID required'),
});

export const costCalculatorBulkUpdateReadSchema =
  costCalculatorBulkIdsSchema.extend({ isRead: z.boolean() });
