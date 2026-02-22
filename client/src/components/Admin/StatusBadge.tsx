interface StatusBadgeProps {
  label: string;
  variant: 'read' | 'unread' | 'published' | 'draft';
  className?: string;
}

const variantClasses = {
  read: 'bg-green-100 text-green-800',
  unread: 'bg-amber-100 text-amber-800',
  published: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-800',
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
