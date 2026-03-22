import { forwardRef, InputHTMLAttributes, useId } from 'react';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
  error?: { message?: string };
};

/**
 * Checkbox aligned with {@link Input}: `border-gray-200`, primary focus ring,
 * red error state, and matching label typography (`text-dark`, `font-bold`).
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const { 'aria-describedby': ariaDescribedBy, ...rest } = props;
    const generatedId = useId();
    const inputId = id ?? (typeof rest.name === 'string' ? rest.name : generatedId);
    const errorId = `${inputId}-error`;
    const describedBy =
      [error?.message ? errorId : null, ariaDescribedBy].filter(Boolean).join(' ') ||
      undefined;

    const inputClassName = [
      'h-4 w-4 shrink-0 cursor-pointer rounded-md [-webkit-tap-highlight-color:transparent]',
      'accent-primary focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:cursor-not-allowed disabled:opacity-50',
      error
        ? 'border border-red-500 focus:border-red-500 focus:ring-red-500'
        : 'border border-gray-200 focus:border-primary focus:ring-primary',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="relative">
        <div className="flex items-center gap-2">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={inputClassName}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            {...rest}
          />
          <label
            htmlFor={inputId}
            className="cursor-pointer select-none text-sm font-bold text-dark"
          >
            {label}
          </label>
        </div>
        {error?.message && (
          <span id={errorId} className="mt-1 block text-sm text-red-500">
            {error.message}
          </span>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
