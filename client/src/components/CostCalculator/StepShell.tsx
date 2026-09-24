import { ReactNode } from 'react';

interface StepShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/** The chrome every question shares: heading, optional sub-line, then its content. */
export function StepShell({ title, subtitle, children }: StepShellProps) {
  return (
    <div>
      <h2 className="text-h3 font-bold text-ink">{title}</h2>
      {subtitle && (
        <p className="mt-2 text-ink-muted">{subtitle}</p>
      )}
      <div className="mt-6">{children}</div>
    </div>
  );
}
