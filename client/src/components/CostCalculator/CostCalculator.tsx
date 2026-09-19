import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  calculateCostRange,
  costCalculatorAnswersSchema,
  DEFAULT_COST_CALCULATOR_CONFIG,
} from '@shirans/shared';
import type {
  CalculatorComponent,
  CostCalculatorConfig,
  CostCalculatorContact,
  CostCalculatorAnswers,
  CostRange,
} from '@shirans/shared';
import { ProgressBar } from './ProgressBar';
import { ResumeBanner } from './ResumeBanner';
import { StepNav } from './StepNav';
import { StepShell } from './StepShell';
import { AreaStep } from './steps/AreaStep';
import { ContactStep } from './steps/ContactStep';
import { IntroStep } from './steps/IntroStep';
import { MultiChoiceStep } from './steps/MultiChoiceStep';
import { SingleChoiceStep } from './steps/SingleChoiceStep';
import { clearCostCalculatorDraft, useCostCalculator } from './useCostCalculator';

export interface CostCalculatorResult {
  answers: CostCalculatorAnswers;
  contact: CostCalculatorContact;
  estimate: CostRange;
}

interface CostCalculatorProps {
  /** Admin-tuned rates; falls back to the shared defaults. */
  config?: CostCalculatorConfig;
  /** Landing pages with their own hero can skip the wizard's intro screen. */
  showIntro?: boolean;
  onComplete: (result: CostCalculatorResult) => Promise<void> | void;
}

export function CostCalculator({
  config = DEFAULT_COST_CALCULATOR_CONFIG,
  showIntro = true,
  onComplete,
}: CostCalculatorProps) {
  const {
    answers,
    setAnswer,
    step,
    stepIndex,
    totalSteps,
    maxAllowedIndex,
    isCurrentStepAnswered,
    goToStep,
    goNext,
    goBack,
    wasRestored,
    dismissRestore,
    resetDraft,
  } = useCostCalculator(showIntro);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const previousStepIndex = useRef(stepIndex);

  /** Which way the content should come from: forward advances leftward in RTL. */
  const enterFromX = stepIndex >= previousStepIndex.current ? -14 : 14;

  /**
   * Only pull the wizard back into view when its top has actually scrolled off.
   * Scrolling on every step — which is what a plain `scrollIntoView` does — reads
   * as the page jumping to the top each time you answer, because the wizard sits
   * well below the fold. Most steps replace content the visitor is already
   * looking at, and the right amount of movement there is none.
   */
  useEffect(() => {
    const didMove = previousStepIndex.current !== stepIndex;
    previousStepIndex.current = stepIndex;
    if (!didMove) return;

    const top = rootRef.current?.getBoundingClientRect().top;
    if (top === undefined || top >= 0) return;

    rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [stepIndex]);

  const handleSubmit = async (contact: CostCalculatorContact) => {
    const parsed = costCalculatorAnswersSchema.safeParse(answers);
    if (!parsed.success) {
      setSubmitError('חלק מהשאלות עדיין לא נענו. חזרו אחורה כדי להשלים אותן.');
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await onComplete({
        answers: parsed.data,
        contact,
        estimate: calculateCostRange(parsed.data, config),
      });
      clearCostCalculatorDraft();
    } catch {
      setSubmitError('שליחת הפרטים נכשלה. אפשר לנסות שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!step) {
    return (
      <div
        ref={rootRef}
        className="scroll-mt-24 rounded-2xl bg-secondary p-6 md:p-10"
        dir="rtl"
      >
        <IntroStep onStart={() => goToStep(0)} />
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="scroll-mt-24 rounded-2xl bg-secondary p-6 md:p-10"
      dir="rtl"
    >
      {wasRestored && (
        <ResumeBanner onReset={resetDraft} onDismiss={dismissRestore} />
      )}

      <ProgressBar
        current={stepIndex}
        total={totalSteps}
        maxAllowedIndex={maxAllowedIndex}
        onJump={goToStep}
      />

      {/* Keyed on the step so each question animates in on its own. Only the
          incoming content moves — an exit animation would double the wait before
          the next question is readable, and the visitor is already looking here.
          Reduced motion keeps the fade and drops the travel. */}
      <motion.div
        key={stepIndex}
        initial={{
          opacity: 0,
          transform: prefersReducedMotion
            ? 'translateX(0px)'
            : `translateX(${enterFromX}px)`,
        }}
        animate={{ opacity: 1, transform: 'translateX(0px)' }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
      >
        <StepShell title={step.title} subtitle={step.subtitle}>
        {step.kind === 'single' && (
          <SingleChoiceStep
            step={step}
            value={answers[step.id] as string | undefined}
            onChange={(value) =>
              setAnswer(
                step.id,
                value as CostCalculatorAnswers[typeof step.id],
              )
            }
          />
        )}

        {step.kind === 'area' && (
          <AreaStep
            value={answers.builtAreaSqm}
            onChange={(value) => setAnswer('builtAreaSqm', value)}
            min={config.builtAreaSqmRange.min}
            max={config.builtAreaSqmRange.max}
            hint={step.hint}
          />
        )}

        {step.kind === 'multi' && (
          <MultiChoiceStep
            step={step}
            value={(answers.components ?? []) as CalculatorComponent[]}
            onChange={(value) => setAnswer('components', value)}
          />
        )}

        {step.kind === 'contact' && (
          <ContactStep
            onBack={goBack}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        )}
        </StepShell>

        {step.kind !== 'contact' && (
          <StepNav
            onBack={goBack}
            onNext={goNext}
            nextDisabled={!isCurrentStepAnswered}
            canGoBack={stepIndex > 0 || showIntro}
          />
        )}
      </motion.div>
    </div>
  );
}
