import {
  formatEstimateRange,
  summarizeAnswers,
} from '@/utils/costCalculatorLeadSummary';
import { adminLeadUrl } from '@/utils/adminLeadUrl';
import type { StoredResult } from './resultStorage';

/**
 * The message the visitor sends Shiran from the result page.
 *
 * It carries the answers and the estimate so she isn't starting the
 * conversation by asking what they already filled in, and a link to the saved
 * lead so she can open the record rather than hunt for it in a list. The link
 * points at her admin, which needs a login — it is a shortcut, not an exposure.
 */
export function buildLeadWhatsAppMessage(result: StoredResult): string {
  const lines = [
    'היי שירן, סיימתי את מחשבון עלות הבית ואשמח לדבר על הפרויקט שלי.',
    '',
    `אומדן שהתקבל: ${formatEstimateRange(result.estimate)}`,
    '',
    'מה שמילאתי:',
    ...summarizeAnswers(result.answers).map(
      ({ label, value }) => `• ${label}: ${value}`,
    ),
  ];

  const leadUrl = result.leadId ? adminLeadUrl(result.leadId) : null;
  if (leadUrl) {
    lines.push('', `הפנייה שלי במערכת: ${leadUrl}`);
  }

  return lines.join('\n');
}
