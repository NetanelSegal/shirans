import { cn } from '@/lib/cn';

/**
 * The one definition of how an action looks, shared by <Button> (does
 * something) and <ButtonLink> (goes somewhere), so the two can't drift apart.
 *
 * Pills are the site's action shape; `text` is the quiet "לפרטים ←" link.
 */
export const BUTTON_VARIANTS = {
  /** Navy pill — the main action on a light surface. */
  primary:
    'bg-primary text-on-dark hover-capable:hover:bg-primary-deep active:bg-primary-deep',
  /** Sand pill — a secondary action on a light surface. */
  secondary:
    'bg-accent-soft text-ink hover-capable:hover:bg-line active:bg-line',
  /** Cream pill — the main action over a photo or a dark band. */
  light:
    'bg-surface text-ink hover-capable:hover:bg-surface-raised active:bg-surface-raised',
  /** Outlined pill — a secondary action over a photo or a dark band. */
  outline:
    'border border-on-dark/60 text-on-dark hover-capable:hover:border-on-dark hover-capable:hover:bg-on-dark/10',
  /** Outlined pill for light surfaces — low-emphasis controls (admin, filters). */
  quiet:
    'border border-line text-ink hover-capable:hover:border-ink-subtle hover-capable:hover:bg-surface-soft',
  /** Destructive — admin only. */
  danger:
    'bg-danger text-on-dark hover-capable:hover:bg-danger/90 active:bg-danger/90',
  /** A text link with an arrow, no pill. */
  text: 'text-ink underline-offset-4 hover-capable:hover:underline',
} as const;

export const BUTTON_SIZES = {
  sm: 'min-h-9 gap-1.5 px-4 text-small',
  md: 'min-h-11 gap-2 px-6 text-body',
  /**
   * The hero action. It only reaches its full size from `sm` up: at 375px a
   * 56px-tall pill with 2rem of padding ran most of the way across the screen
   * and read as a banner rather than a button.
   */
  lg: 'min-h-12 gap-2 px-6 text-body sm:min-h-14 sm:gap-2.5 sm:px-8 sm:text-lead',
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;
export type ButtonSize = keyof typeof BUTTON_SIZES;

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}) {
  return cn(
    'inline-flex select-none items-center justify-center whitespace-nowrap font-semibold',
    'transition-[background-color,border-color,color,transform] duration-200 ease-out',
    'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
    variant === 'text'
      ? 'min-h-0 gap-1.5 px-0 text-small'
      : cn('rounded-full', BUTTON_SIZES[size]),
    BUTTON_VARIANTS[variant],
    fullWidth && 'w-full',
    className,
  );
}
