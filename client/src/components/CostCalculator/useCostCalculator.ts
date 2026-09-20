import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { CostCalculatorAnswers } from '@shirans/shared';
import { COST_CALCULATOR_STEPS, TOTAL_STEPS } from './costCalculatorSteps';
import type { StepDefinition } from './types';

export type CostCalculatorDraft = Partial<CostCalculatorAnswers>;

const STORAGE_KEY = 'costCalculator:draft';
/** Bump when the questions change — older drafts are then discarded, not half-applied. */
const STORAGE_VERSION = 3;
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** The intro screen sits before the numbered steps. */
export const INTRO_INDEX = -1;

interface StoredDraft {
  version: number;
  savedAt: number;
  answers: CostCalculatorDraft;
}

/**
 * Storage can throw (private mode, blocked site data) or hold something from an
 * older build, so every read is defensive and a bad draft is simply ignored —
 * the wizard always has to work without it.
 */
function readDraft(): CostCalculatorDraft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredDraft;
    const isUsable =
      parsed?.version === STORAGE_VERSION &&
      typeof parsed.savedAt === 'number' &&
      Date.now() - parsed.savedAt < DRAFT_TTL_MS &&
      parsed.answers &&
      Object.keys(parsed.answers).length > 0;

    return isUsable ? parsed.answers : null;
  } catch {
    return null;
  }
}

function writeDraft(answers: CostCalculatorDraft): void {
  try {
    const payload: StoredDraft = {
      version: STORAGE_VERSION,
      savedAt: Date.now(),
      answers,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Not being able to save a draft is never a reason to break the wizard.
  }
}

export function clearCostCalculatorDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function isStepAnswered(
  step: StepDefinition,
  answers: CostCalculatorDraft,
): boolean {
  switch (step.kind) {
    case 'area':
      return typeof answers.builtAreaSqm === 'number';
    case 'multi':
      // Choosing none of the extras is a legitimate answer.
      return true;
    case 'contact':
      // Owned by the contact form's own validation, not the draft.
      return false;
    case 'single':
      return answers[step.id] !== undefined;
  }
}

/** How far the wizard may be entered — the first question still unanswered. */
function furthestAllowedIndex(answers: CostCalculatorDraft): number {
  const firstUnanswered = COST_CALCULATOR_STEPS.findIndex(
    (step) => !isStepAnswered(step, answers),
  );
  return firstUnanswered === -1 ? TOTAL_STEPS - 1 : firstUnanswered;
}

export function useCostCalculator(showIntro: boolean) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [answers, setAnswers] = useState<CostCalculatorDraft>(
    () => readDraft() ?? {},
  );
  const [wasRestored, setWasRestored] = useState(
    () => Object.keys(readDraft() ?? {}).length > 0,
  );

  useEffect(() => {
    if (Object.keys(answers).length > 0) writeDraft(answers);
  }, [answers]);

  const maxAllowedIndex = furthestAllowedIndex(answers);

  /**
   * The step lives in the URL, so the browser's own back/forward buttons move
   * through the wizard and a reload lands where the visitor left off.
   */
  const requestedIndex = Number(searchParams.get('step') ?? NaN) - 1;
  const stepIndex = Number.isNaN(requestedIndex)
    ? showIntro
      ? INTRO_INDEX
      : 0
    : Math.min(Math.max(requestedIndex, 0), maxAllowedIndex);

  const goToStep = useCallback(
    (index: number, options?: { replace?: boolean }) => {
      const params = new URLSearchParams(searchParams);
      if (index <= INTRO_INDEX) {
        params.delete('step');
      } else {
        params.set('step', String(index + 1));
      }
      setSearchParams(params, { replace: options?.replace ?? false });
    },
    [searchParams, setSearchParams],
  );

  const setAnswer = useCallback(
    <K extends keyof CostCalculatorAnswers>(
      key: K,
      value: CostCalculatorAnswers[K],
    ) => {
      setWasRestored(false);
      setAnswers((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const resetDraft = useCallback(() => {
    clearCostCalculatorDraft();
    setAnswers({});
    setWasRestored(false);
    goToStep(showIntro ? INTRO_INDEX : 0, { replace: true });
  }, [goToStep, showIntro]);

  const step = stepIndex >= 0 ? COST_CALCULATOR_STEPS[stepIndex] : null;

  return useMemo(
    () => ({
      answers,
      setAnswer,
      step,
      stepIndex,
      totalSteps: TOTAL_STEPS,
      maxAllowedIndex,
      isCurrentStepAnswered: step ? isStepAnswered(step, answers) : true,
      goToStep,
      goNext: () => goToStep(stepIndex + 1),
      goBack: () => goToStep(stepIndex - 1),
      wasRestored,
      dismissRestore: () => setWasRestored(false),
      resetDraft,
    }),
    [
      answers,
      setAnswer,
      step,
      stepIndex,
      maxAllowedIndex,
      goToStep,
      wasRestored,
      resetDraft,
    ],
  );
}
