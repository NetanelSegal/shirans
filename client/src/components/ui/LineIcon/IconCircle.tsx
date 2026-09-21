import { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { LineIcon, LineIconName } from './LineIcon';

const VARIANTS = {
  /** Cream icon on a bronze disc — contact details. */
  accent: 'bg-accent text-on-dark',
  /** Sand disc with a hairline ring — process step numbers. */
  soft: 'bg-surface-sunken text-ink ring-1 ring-line',
  /** Hairline ring only — over photos and dark bands. */
  outline: 'text-on-dark ring-1 ring-on-dark/50',
} as const;

const SIZES = { sm: 'size-10', md: 'size-12', lg: 'size-16' } as const;

/**
 * A round badge holding an icon or a number (the process timeline's 01–05).
 */
export function IconCircle({
  icon,
  children,
  variant = 'accent',
  size = 'md',
  className,
}: {
  icon?: LineIconName;
  children?: ReactNode;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
    >
      {icon ? <LineIcon name={icon} className='size-[45%]' strokeWidth={1.5} /> : children}
    </span>
  );
}
