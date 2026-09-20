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
  // One read, two pieces of state: reading storage twice let them disagree.
  const [restoredDraft] = useState(() => readDraft() ?? {});
  const [answers, setAnswers] = useState<CostCalculatorDraft>(restoredDraft);
  const [wasRestored, setWasRestored] = useState(
    () => Object.keys(restoredDraft).length > 0,
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

  /**
   * A step filling in a value of its own accord — a default it has to show, or
   * a restored answer pulled back into range.
   *
   * Separate from `setAnswer` because of the restore banner. Merely arriving at
   * a step that pre-fills itself is not the visitor answering anything, and
   * treating it as such made "we picked up where you left off" vanish before
   * they had done a thing.
   */
  const seedAnswer = useCallback(
    <K extends keyof CostCalculatorAnswers>(
      key: K,
      value: CostCalculatorAnswers[K],
    ) => {
      setAnswers((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  /** The visitor answered. That retires the restore banner. */
  const setAnswer = useCallback(
    <K extends keyof CostCalculatorAnswers>(
      key: K,
      value: CostCalculatorAnswers[K],
    ) => {
      setWasRestored(false);
      seedAnswer(key, value);
    },
    [seedAnswer],
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
      seedAnswer,
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
      seedAnswer,
      step,
      stepIndex,
      maxAllowedIndex,
      goToStep,
      wasRestored,
      resetDraft,
    ],
  );
}
