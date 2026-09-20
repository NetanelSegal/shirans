import type { CostCalculatorAnswers, CostRange } from '@shirans/shared';

const RESULT_KEY = 'costCalculator:result';

export interface StoredResult {
  answers: CostCalculatorAnswers;
  estimate: CostRange;
  /**
   * The saved lead's id, so a message sent from this page can point Shiran
   * straight at the record. Absent on a result stored before this existed, and
   * the page has to work without it.
   */
  leadId?: string;
}

/**
 * Handed from the wizard to the result page through sessionStorage rather than
 * router state, so a refresh on the result page still shows the estimate.
 * Deliberately carries no contact details — the result page doesn't need them,
 * and the wizard promises they stay with us.
 */
export function storeResult(result: StoredResult): void {
  try {
    sessionStorage.setItem(RESULT_KEY, JSON.stringify(result));
  } catch {
    // Non-fatal: the result page falls back to sending them back to the wizard.
  }
}

export function readResult(): StoredResult | null {
  try {
    const raw = sessionStorage.getItem(RESULT_KEY);
    return raw ? (JSON.parse(raw) as StoredResult) : null;
  } catch {
    return null;
  }
}
