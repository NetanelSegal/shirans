import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type CardProps<T extends ElementType> = {
  as?: T;
  /** Lift on hover — for cards that are links. */
  interactive?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

/** A white panel on the cream page: small radius, soft shadow. */
export function Card<T extends ElementType = 'div'>({
  as,
  interactive = false,
  children,
  className,
  ...rest
}: CardProps<T>) {
  const Tag = as ?? 'div';
  return (
    <Tag
      className={cn(
        'overflow-hidden rounded-card bg-surface-raised shadow-card',
        interactive &&
          'transition-[box-shadow,transform] duration-300 ease-out hover-capable:hover:-translate-y-1 hover-capable:hover:shadow-raised',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
