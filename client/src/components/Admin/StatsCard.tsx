import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  count: number;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function StatsCard({
  title,
  count,
  icon,
  onClick,
  className = '',
}: StatsCardProps) {
  const content = (
    <div
      className={`rounded-card border border-line/70 bg-surface-raised p-6 shadow-card transition-shadow hover:shadow-card ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      aria-label={onClick ? `${title}: ${count}. לחץ לפתיחה` : undefined}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ink-subtle">{title}</p>
          <p className="mt-2 text-3xl font-bold text-ink">{count}</p>
        </div>
        {icon && (
          <div className="rounded-card bg-primary/10 p-3 text-ink">
            {icon}
          </div>
        )}
      </div>
    </div>
  );

  return content;
}
