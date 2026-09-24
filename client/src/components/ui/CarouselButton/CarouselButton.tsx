import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * The round white arrow at a carousel's edge. `direction` is the reading
 * direction: in RTL "next" points left.
 */
export function CarouselButton({
  direction,
  onClick,
  disabled,
  className,
}: {
  direction: 'previous' | 'next';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const Icon = direction === 'next' ? ChevronLeft : ChevronRight;
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'next' ? 'הבא' : 'הקודם'}
      className={cn(
        'inline-flex size-11 items-center justify-center rounded-full bg-surface-raised text-ink shadow-card',
        'transition-[transform,box-shadow,opacity] duration-200 ease-out',
        'hover-capable:hover:shadow-raised active:scale-95 disabled:opacity-40',
        className,
      )}
    >
      <Icon className='size-5' strokeWidth={1.5} aria-hidden />
    </button>
  );
}
