import { z } from 'zod';

const finishLevel = z.enum(['standard', 'invested', 'premium']);
const poolOption = z.enum(['none', 'small', 'medium', 'large']);
const carpentryOption = z.enum(['none', 'ready', 'custom']);
const furnitureOption = z.enum(['none', 'basic', 'full']);
const priceDisplayOption = z.enum(['before_vat', 'including_vat']);

export const calculatorFormSchema = z.object({
  // User details
  name: z
    .string()
    .min(2, 'שם חייב להכיל לפחות 2 תווים')
    .max(50, 'שם חייב להכיל פחות מ-50 תווים'),
  phoneNumber: z
    .string()
    .length(10, 'מספר טלפון חייב להכיל בדיוק 10 ספרות')
    .regex(/^\d+$/, 'מספר טלפון חייב להכיל ספרות בלבד'),
  email: z
    .string()
    .email('כתובת אימייל לא תקינה')
    .min(5, 'אימייל חייב להכיל לפחות 5 תווים')
    .max(50, 'אימייל חייב להכיל פחות מ-50 תווים'),

  // Building inputs
  builtAreaSqm: z.coerce
    .number()
    .min(160, 'שטח בנוי מינימלי: 160 מ״ר')
    .max(500, 'שטח בנוי מקסימלי: 500 מ״ר'),
  constructionFinish: finishLevel,
  pool: poolOption,
  outdoorAreaSqm: z.coerce
    .number()
    .min(0, 'שטח פיתוח חוץ לא יכול להיות שלילי'),
  outdoorFinish: finishLevel,
  kitchen: finishLevel,
  carpentry: carpentryOption,
  furniture: furnitureOption,
  equipment: furnitureOption,
  priceDisplay: priceDisplayOption,
});

export type CalculatorFormInput = z.infer<typeof calculatorFormSchema>;
