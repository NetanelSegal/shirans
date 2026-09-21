import { formatShekels } from '@shirans/shared';

interface ShekelAmountProps {
  value: number;
  className?: string;
}

/**
 * A shekel figure.
 *
 * The digits and the ₪ stay one unbreakable unit: in an RTL line the sign
 * otherwise drifts away from the number it belongs to. The visible text is
 * hidden from assistive technology and replaced with a spoken form, because
 * "4,020,000 ₪" is read out as a bare number followed by a symbol.
 */
export function ShekelAmount({ value, className = '' }: ShekelAmountProps) {
  return (
    <span className={className} aria-label={`${formatShekels(value)} שקלים`}>
      <span className="whitespace-nowrap" aria-hidden>
        {formatShekels(value)} ₪
      </span>
    </span>
  );
}
