import emailjs from '@emailjs/browser';
import type { CostCalculatorAnswers, CostRange } from '@shirans/shared';
import { envConfig, isEmailJsCalculatorConfigured } from '@/config/env';
import {
  formatEstimateRange,
  summarizeAnswers,
} from '@/utils/costCalculatorLeadSummary';

interface LeadNotification {
  name: string;
  email: string;
  phoneNumber: string;
  marketingConsent: boolean;
  answers: CostCalculatorAnswers;
  estimate: CostRange;
}

/**
 * Tells Shiran a lead came in, through the same EmailJS setup the contact form
 * uses.
 *
 * This is a notification, not the record: the lead is already in the database
 * and on the admin screen before this runs. So it stays out of the visitor's
 * way — if EmailJS isn't configured, or the send fails, nothing about their
 * submission changes.
 */
export async function sendCalculatorLeadNotification({
  name,
  email,
  phoneNumber,
  marketingConsent,
  answers,
  estimate,
}: LeadNotification): Promise<void> {
  if (!isEmailJsCalculatorConfigured()) return;

  const { serviceId, calculatorTemplateId: templateId, publicKey } = envConfig.emailjs;

  await emailjs.send(
    serviceId,
    templateId,
    {
      lead_name: name,
      lead_email: email,
      lead_phone: phoneNumber,
      marketing_consent: marketingConsent ? 'כן' : 'לא',
      estimate: formatEstimateRange(estimate),
      // One block rather than a field per question, so adding a question to the
      // wizard doesn't also mean editing the EmailJS template.
      answers: summarizeAnswers(answers)
        .map(({ label, value }) => `${label}: ${value}`)
        .join('\n'),
      created_at: new Date().toLocaleString('he-IL'),
    },
    { publicKey },
  );
}
