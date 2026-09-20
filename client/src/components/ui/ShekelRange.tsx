import { formatShekels } from '@shirans/shared';

interface ShekelRangeProps {
  min: number;
  max: number;
  className?: string;
}

/**
 * A price range in shekels.
 *
 * Each amount is its own element carrying its own ₪, because a single
 * "X ₪ – Y ₪" string gets reordered by bidi in an RTL context and the dash
 * drifts to the wrong end. The parts are hidden from assistive technology and
 * replaced by one label, since read individually they come out as two
 * unconnected numbers with nothing between them.
 */
export function ShekelRange({ min, max, className = '' }: ShekelRangeProps) {
  return (
    <span
      className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-1 ${className}`}
      aria-label={`טווח משוער, בין ${formatShekels(min)} ל־${formatShekels(max)} שקלים`}
    >
      <span className="whitespace-nowrap" aria-hidden>
        {formatShekels(min)} ₪
      </span>
      <span aria-hidden>–</span>
      <span className="whitespace-nowrap" aria-hidden>
        {formatShekels(max)} ₪
      </span>
    </span>
  );
}
