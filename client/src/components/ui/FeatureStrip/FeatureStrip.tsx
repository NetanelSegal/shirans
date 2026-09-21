import { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { LineIcon, LineIconName } from '../LineIcon';

export interface Feature {
  icon: LineIconName;
  title: ReactNode;
  description?: ReactNode;
}

/**
 * A row of line icons with short labels, split by vertical hairlines — the
 * band under the home hero, the values on About, the promises in the contact
 * band. Wraps to a 2-up grid on phones with the dividers turned horizontal.
 */
export function FeatureStrip({
  items,
  tone = 'light',
  size = 'md',
  className,
}: {
  items: Feature[];
  tone?: 'light' | 'dark';
  size?: 'sm' | 'md';
  className?: string;
}) {
  const isDark = tone === 'dark';
  return (
    <ul
      className={cn(
        'grid grid-cols-2',
        items.length === 3 ? 'grid-cols-3' : 'md:grid-cols-4',
        className,
      )}
    >
      {items.map(({ icon, title, description }, index) => (
        <li
          key={index}
          className={cn(
            'flex flex-col items-center gap-3 px-3 py-5 text-center md:px-6',
            // Hairlines between items, never on the outer edge.
            'border-line/60 md:[&:not(:last-child)]:border-e',
            isDark && 'border-on-dark/20',
            items.length === 3 && '[&:not(:last-child)]:border-e',
          )}
        >
          <LineIcon
            name={icon}
            className={cn(size === 'sm' ? 'size-6' : 'size-8', isDark ? 'text-on-dark' : 'text-accent')}
          />
          <p
            className={cn(
              'font-semibold',
              size === 'sm' ? 'text-small' : 'text-h3',
              isDark ? 'text-on-dark' : 'text-ink',
            )}
          >
            {title}
          </p>
          {description && (
            <p className={cn('text-small', isDark ? 'text-on-dark/75' : 'text-ink-muted')}>
              {description}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
