import emailjs from '@emailjs/nodejs';
import type { CalculatorLeadResponse } from '@shirans/shared';
import { getLeadDisplayEstimate, formatPrice } from '@shirans/shared';
import logger from '../middleware/logger';

const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || 'calculator_lead_notification';
const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export const emailService = {
  async sendNewLeadNotification(lead: CalculatorLeadResponse): Promise<void> {
    if (!SERVICE_ID || !PUBLIC_KEY || !PRIVATE_KEY || !ADMIN_EMAIL) {
      logger.warn('EmailJS or ADMIN_EMAIL not configured - skipping lead notification');
      return;
    }

    const estimate = getLeadDisplayEstimate(lead);
    const templateParams = {
      to_email: ADMIN_EMAIL,
      subject: `ליד חדש ממחשבון אומדן - ${lead.name}`,
      lead_name: lead.name,
      lead_email: lead.email,
      lead_phone: lead.phoneNumber,
      estimate: `₪ ${formatPrice(estimate)}`,
      built_area: `${lead.builtAreaSqm} מ״ר`,
      construction_finish: lead.constructionFinish,
      pool: lead.pool,
      outdoor_area: `${lead.outdoorAreaSqm} מ״ר`,
      outdoor_finish: lead.outdoorFinish,
      kitchen: lead.kitchen,
      carpentry: lead.carpentry,
      furniture: lead.furniture,
      equipment: lead.equipment,
      created_at: new Date(lead.createdAt).toLocaleDateString('he-IL'),
    };

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
      publicKey: PUBLIC_KEY,
      privateKey: PRIVATE_KEY,
    });
  },
};
