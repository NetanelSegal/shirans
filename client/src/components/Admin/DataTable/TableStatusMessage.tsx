import { ReactNode } from 'react';

export function TableStatusMessage({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-card border border-line/70 bg-surface-raised p-12 text-center text-ink-subtle"
      role="status"
      aria-live="polite"
    >
      {children}
    </div>
  );
}
