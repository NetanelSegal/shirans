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
      <h2 className="subheading font-bold text-primary">{title}</h2>
      {subtitle && (
        <p className="mt-2 text-primary/70">{subtitle}</p>
      )}
      <div className="mt-6">{children}</div>
    </div>
  );
}
