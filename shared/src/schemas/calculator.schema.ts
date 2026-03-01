import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

const finishLevel = z.enum(['standard', 'invested', 'premium']);
const poolOption = z.enum(['none', 'small', 'medium', 'large']);
const carpentryOption = z.enum(['none', 'ready', 'custom']);
const furnitureOption = z.enum(['none', 'basic', 'full']);

export const calculatorFormSchema = z
  .object({
    // User details
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
      .min(5, 'אימייל חייב להכיל לפחות 5 תווים')
      .max(50, 'אימייל חייב להכיל פחות מ-50 תווים')
      .transform((val) => DOMPurify.sanitize(val.trim())),

    // Building inputs
    builtAreaSqm: z
      .number()
      .min(160, 'שטח בנוי מינימלי: 160 מ״ר')
      .max(500, 'שטח בנוי מקסימלי: 500 מ״ר'),
    constructionFinish: finishLevel,
    pool: poolOption,
    outdoorAreaSqm: z.number().min(0, 'שטח פיתוח חוץ לא יכול להיות שלילי'),
    outdoorFinish: finishLevel,
    kitchen: finishLevel,
    carpentry: carpentryOption,
    furniture: furnitureOption,
    equipment: furnitureOption,
  })
  .strict();

export type CalculatorFormInput = z.infer<typeof calculatorFormSchema>;

/** Schema for submitting a calculator lead (API) — priceDisplay fixed as before_vat */
export const submitCalculatorLeadSchema = calculatorFormSchema.extend({
  estimate: z.number(),
  priceDisplay: z.literal('before_vat').default('before_vat'),
});

export type SubmitCalculatorLeadInput = z.infer<typeof submitCalculatorLeadSchema>;

/** Schema for calculator config (admin editable rates) */
export const calculatorConfigSchema = z.object({
  constructionBase: z.object({ min: z.number(), max: z.number() }),
  outdoorBase: z.object({ min: z.number(), max: z.number() }),
  finishMultipliers: z.object({
    standard: z.object({ min: z.number(), max: z.number() }),
    invested: z.object({ min: z.number(), max: z.number() }),
    premium: z.object({ min: z.number(), max: z.number() }),
  }),
  poolAddons: z.object({
    none: z.object({ min: z.number(), max: z.number() }),
    small: z.object({ min: z.number(), max: z.number() }),
    medium: z.object({ min: z.number(), max: z.number() }),
    large: z.object({ min: z.number(), max: z.number() }),
  }),
  kitchenAddons: z.object({
    standard: z.object({ min: z.number(), max: z.number() }),
    invested: z.object({ min: z.number(), max: z.number() }),
    premium: z.object({ min: z.number(), max: z.number() }),
  }),
  carpentryAddons: z.object({
    none: z.object({ min: z.number(), max: z.number() }),
    ready: z.object({ min: z.number(), max: z.number() }),
    custom: z.object({ min: z.number(), max: z.number() }),
  }),
  furnitureAddons: z.object({
    none: z.object({ min: z.number(), max: z.number() }),
    basic: z.object({ min: z.number(), max: z.number() }),
    full: z.object({ min: z.number(), max: z.number() }),
  }),
  equipmentAddons: z.object({
    none: z.object({ min: z.number(), max: z.number() }),
    basic: z.object({ min: z.number(), max: z.number() }),
    full: z.object({ min: z.number(), max: z.number() }),
  }),
  vatMultiplier: z.number(),
});

export type CalculatorConfigInput = z.infer<typeof calculatorConfigSchema>;

export const calculatorLeadsQuerySchema = z.object({
  isRead: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) =>
      v === 'true' ? true : v === 'false' ? false : undefined,
    ),
});

export const calculatorLeadIdSchema = z.object({
  id: z.string().cuid('Lead ID must be a valid CUID'),
});

export const calculatorUpdateReadSchema = z.object({
  isRead: z.boolean(),
});
