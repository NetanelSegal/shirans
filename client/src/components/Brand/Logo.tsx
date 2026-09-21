import logoUrl from '@/assets/shiran_logo.svg';
import { cn } from '@/lib/cn';

/**
 * The "Shiran / אדריכלות ועיצוב פנים" wordmark in the current text color.
 *
 * The SVG is drawn in white; used as a mask it takes `currentColor`, so the
 * same file serves the cream navbar-over-photo, the navy footer and anything
 * else — `text-on-dark`, `text-ink`.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      role='img'
      aria-label='שירן גלעד — אדריכלות ועיצוב פנים'
      className={cn('block aspect-[642.75/252.35] h-11 bg-current', className)}
      style={{
        maskImage: `url(${logoUrl})`,
        WebkitMaskImage: `url(${logoUrl})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
      }}
    />
  );
}
