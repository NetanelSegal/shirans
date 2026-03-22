import { forwardRef, InputHTMLAttributes, useId } from 'react';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
  error?: { message?: string };
};

/**
 * Toggle styled like {@link Button} / {@link Input}: `rounded-xl`, border,
 * primary fill when checked. Native checkbox is visually hidden for a11y and RHF.
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

    const labelClassName = [
      'inline-flex min-h-[2.5rem] cursor-pointer select-none items-center justify-center',
      'rounded-xl border px-4 py-2 text-sm font-bold transition-all duration-200',
      '[-webkit-tap-highlight-color:transparent]',
      'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-offset-0',
      error
        ? [
            'border-red-500 bg-red-50/80 text-dark',
            'peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary',
            'peer-focus-visible:ring-red-500 peer-checked:peer-focus-visible:ring-primary',
          ].join(' ')
        : [
            'border-gray-200 bg-gray-100 text-dark',
            'hover-capable:hover:bg-gray-200',
            'peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary',
            'hover-capable:peer-checked:hover:bg-primary/90',
            'peer-focus-visible:ring-primary',
          ].join(' '),
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="relative inline-flex flex-col">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className="peer sr-only"
          aria-invalid={!!error}
          aria-describedby={describedBy}
          {...rest}
        />
        <label htmlFor={inputId} className={labelClassName}>
          {label}
        </label>
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
