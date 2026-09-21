interface StatusBadgeProps {
  label: string;
  variant: 'read' | 'unread' | 'published' | 'draft';
  className?: string;
}

const variantClasses = {
  read: 'bg-success-soft text-success',
  unread: 'bg-warning-soft text-warning',
  published: 'bg-success-soft text-success',
  draft: 'bg-surface-sunken text-ink-muted',
};

export function StatusBadge({
  label,
  variant,
  className = '',
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
      role="status"
      aria-label={label}
    >
      {label}
    </span>
  );
}
