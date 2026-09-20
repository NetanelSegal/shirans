import { ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { BUTTON_RESET } from './buttonReset';

/**
 * `index.css` grows every button by 5% on hover, which is a lot of movement for
 * the controls you press ten times in a row. Trading it for a press-in reads as
 * responsiveness rather than fidgeting.
 */
const PRESS =
  'hover-capable:hover:scale-100 active:scale-[0.97] transition-transform duration-150 ease-out motion-reduce:transition-none motion-reduce:active:scale-100';

interface StepNavProps {
  onBack: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  /** Submitting forms drive the next action through the form itself. */
  nextType?: 'button' | 'submit';
  /** False on the first screen, where there is nothing behind it. */
  canGoBack?: boolean;
}

export function StepNav({
  onBack,
  onNext,
  nextLabel = 'המשך',
  nextDisabled = false,
  nextType = 'button',
  canGoBack = true,
}: StepNavProps) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      {/* Back is a quiet text control rather than a second filled pill: two pills
          of equal weight make the visitor choose between them, and the shared
          `light` variant is a cool grey that belongs to no part of this palette. */}
      {canGoBack ? (
        <button
          type="button"
          onClick={onBack}
          className={`${BUTTON_RESET} ${PRESS} flex items-center gap-1.5 rounded-lg px-2 py-2 text-primary/70 hover-capable:hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary`}
        >
          <ArrowRight className="size-4" aria-hidden />
          חזרה
        </button>
      ) : (
        <span />
      )}
      <Button
        variant="primary"
        type={nextType}
        onClick={nextType === 'submit' ? undefined : onNext}
        disabled={nextDisabled}
        className={`group flex items-center gap-2 px-8 disabled:cursor-not-allowed disabled:opacity-50 ${PRESS}`}
      >
        {nextLabel}
        {/* Nudges toward the direction of travel on hover — a small hint that this
            is the control that moves you on. */}
        <ArrowLeft
          className="size-4 transition-transform duration-200 ease-out hover-capable:group-hover:-translate-x-0.5 motion-reduce:transition-none motion-reduce:hover-capable:group-hover:translate-x-0"
          aria-hidden
        />
      </Button>
    </div>
  );
}
