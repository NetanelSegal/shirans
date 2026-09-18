import { ReactNode } from 'react';

export function TableStatusMessage({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-500"
      role="status"
      aria-live="polite"
    >
      {children}
    </div>
  );
}
