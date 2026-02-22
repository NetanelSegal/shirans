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
      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${className}`}
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
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-primary">{count}</p>
        </div>
        {icon && (
          <div className="rounded-lg bg-primary/10 p-3 text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );

  return content;
}
