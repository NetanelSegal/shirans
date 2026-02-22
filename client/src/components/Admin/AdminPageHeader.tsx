import { ReactNode } from 'react';
import Button from '@/components/ui/Button';

interface AdminPageHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

export function AdminPageHeader({
  title,
  actionLabel,
  onAction,
  children,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl font-bold text-primary">{title}</h1>
      <div className="flex flex-wrap items-center gap-2">
        {actionLabel && onAction && (
          <Button onClick={onAction} variant="primary">
            {actionLabel}
          </Button>
        )}
        {children}
      </div>
    </div>
  );
}
