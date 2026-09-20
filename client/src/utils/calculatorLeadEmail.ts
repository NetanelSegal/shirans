import emailjs from '@emailjs/browser';
import type { CostCalculatorLeadResponse } from '@shirans/shared';
import { envConfig, isEmailJsCalculatorConfigured } from '@/config/env';
import { adminLeadUrl } from '@/utils/adminLeadUrl';
import {
  formatEstimateRange,
  summarizeAnswers,
} from '@/utils/costCalculatorLeadSummary';

/**
 * Tells Shiran a lead came in, through the same EmailJS setup the contact form
 * uses.
 *
 * Built from the saved lead rather than from what the wizard had in hand, so
 * the estimate and the timestamp in the email are the ones actually stored. The
 * two would normally agree, but the estimate is recomputed server-side and the
 * clock is the server's, and a notification that disagrees with the admin
 * screen is worse than no notification.
 *
 * This is a notification, not the record: the lead is already in the database
 * and on the admin screen before this runs. So it stays out of the visitor's
 * way — if EmailJS isn't configured, or the send fails, nothing about their
 * submission changes.
 *
 * The template lives in the EmailJS dashboard; its source of truth is
 * docs/email-templates/calculator-lead-notification.html.
 */
export async function sendCalculatorLeadNotification(
  lead: CostCalculatorLeadResponse,
): Promise<void> {
  if (!isEmailJsCalculatorConfigured()) return;

  const { serviceId, calculatorTemplateId: templateId, publicKey } = envConfig.emailjs;

  await emailjs.send(
    serviceId,
    templateId,
    {
      lead_url: adminLeadUrl(lead.id),
      lead_name: lead.name,
      lead_email: lead.email,
      lead_phone: lead.phoneNumber,
      // So hitting Reply answers the person who asked, not the sending account.
      reply_to: lead.email,
      marketing_consent: lead.marketingConsent ? 'כן' : 'לא',
      estimate: formatEstimateRange({
        min: lead.estimateMin,
        max: lead.estimateMax,
      }),
      // One block rather than a field per question, so adding a question to the
      // wizard doesn't also mean editing the EmailJS template.
      answers: summarizeAnswers(lead)
        .map(({ label, value }) => `${label}: ${value}`)
        .join('\n'),
      created_at: new Date(lead.createdAt).toLocaleString('he-IL'),
    },
    { publicKey },
  );
}
