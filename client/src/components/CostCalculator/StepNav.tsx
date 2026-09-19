import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

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
      {canGoBack ? (
        <Button variant="light" onClick={onBack} className={`px-6 ${PRESS}`}>
          חזרה
        </Button>
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
