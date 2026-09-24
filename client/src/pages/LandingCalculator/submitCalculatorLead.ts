import { calculateCost, type CostCalculatorConfig } from '@shirans/shared';
import type { CostCalculatorResult } from '@/components/CostCalculator';
import { isPreviewDeploy } from '@/config/env';
import { calculatorService } from '@/services/calculator.service';
import { sendCalculatorLeadNotification } from '@/utils/calculatorLeadEmail';
import { storeResult } from '@/pages/CalculatorResult/resultStorage';

/**
 * What happens when someone finishes the wizard.
 *
 * Order matters. The lead is saved first and is allowed to fail loudly — the
 * wizard shows the error and the visitor can try again, with their answers
 * still in the draft. The notification email is a convenience on top of a row
 * that already exists, so a failure there is logged and otherwise ignored;
 * making someone re-enter their details because an email provider hiccuped
 * would be the wrong trade.
 */
export async function submitCalculatorLead(
  { answers, contact }: CostCalculatorResult,
  config: CostCalculatorConfig,
): Promise<void> {
  /*
   * A preview deploy shares the production database and alert inbox, so it
   * must not save a lead or email Shiran — but it still has to reach the result
   * page, or that page can't be reviewed on the preview at all. It computes the
   * estimate here with the same `calculateCost` the server runs, from the same
   * config, and stores it without a lead id; the result page already handles
   * a result that has none.
   */
  if (isPreviewDeploy) {
    storeResult({ answers, estimate: calculateCost(answers, config) });
    return;
  }

  const lead = await calculatorService.submitLead({ ...answers, ...contact });

  // Built from the saved row, so what Shiran reads matches what is stored.
  void sendCalculatorLeadNotification(lead).catch((error: unknown) => {
    console.error('Calculator lead notification failed to send', error);
  });

  // The saved row again, not the wizard's copy: the page shows the number that
  // was actually recorded, and the id lets a message link straight to it.
  storeResult({
    answers,
    estimate: lead.estimate,
    leadId: lead.id,
  });
}
