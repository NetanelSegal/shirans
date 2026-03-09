import emailjs from '@emailjs/browser';
import type { CalculatorFormInput } from '@shirans/shared';
import { formatPrice } from '@shirans/shared';
import { envConfig, isEmailJsCalculatorConfigured } from '@/config/env';

const ENUM_LABELS_HE: Record<string, string> = {
  standard: 'סטנדרט',
  invested: 'מושקע',
  premium: 'יוקרתי',
  none: 'ללא',
  small: 'קטנה',
  medium: 'בינונית',
  large: 'גדולה',
  ready: 'קנייה מוכנה',
  custom: 'ייצור לפי הזמנה',
  basic: 'בסיסי',
  full: 'מלא',
};

function formatEnum(value: string): string {
  return ENUM_LABELS_HE[value] ?? value;
}

/**
 * Sends admin notification email when a new calculator lead is submitted.
 * Uses EmailJS client-side (same pattern as contact form).
 * Skips silently if VITE_EMAILJS_CALCULATOR_TEMPLATE_ID is not configured.
 */
export async function sendCalculatorLeadNotification(
  data: CalculatorFormInput,
  estimate: number
): Promise<void> {
  if (!isEmailJsCalculatorConfigured()) {
    return;
  }

  const { serviceId, calculatorTemplateId: templateId, publicKey } = envConfig.emailjs;
  const templateParams = {
    lead_name: data.name,
    lead_email: data.email,
    lead_phone: data.phoneNumber,
    estimate: `₪ ${formatPrice(estimate)}`,
    built_area: `${data.builtAreaSqm} מ״ר`,
    construction_finish: formatEnum(data.constructionFinish),
    pool: formatEnum(data.pool),
    outdoor_area: `${data.outdoorAreaSqm} מ״ר`,
    outdoor_finish: formatEnum(data.outdoorFinish),
    kitchen: formatEnum(data.kitchen),
    carpentry: formatEnum(data.carpentry),
    furniture: formatEnum(data.furniture),
    equipment: formatEnum(data.equipment),
    created_at: new Date().toLocaleDateString('he-IL'),
  };

  await emailjs.send(serviceId, templateId, templateParams, { publicKey });
}
