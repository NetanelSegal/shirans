import { forwardRef, InputHTMLAttributes, useId } from 'react';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
  error?: { message?: string };
};

/** Custom checkbox: small bordered tile + checkmark when checked (not native glyph, not a pill button). */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const { 'aria-describedby': ariaDescribedBy, ...rest } = props;
    const generatedId = useId();
    const inputId = id ?? (typeof rest.name === 'string' ? rest.name : generatedId);
    const errorId = `${inputId}-error`;
    const describedBy =
      [error?.message ? errorId : null, ariaDescribedBy].filter(Boolean).join(' ') ||
      undefined;

    const boxClassName = [
      'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors',
      '[-webkit-tap-highlight-color:transparent]',
      'bg-white peer-checked:border-primary peer-checked:bg-primary',
      'hover-capable:border-gray-300 peer-checked:hover-capable:border-primary',
      error
        ? 'border-red-500 peer-focus-visible:ring-2 peer-focus-visible:ring-red-500 peer-focus-visible:ring-offset-0'
        : 'border-gray-200 peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-0',
      'peer-disabled:opacity-50',
      'peer-checked:[&>svg]:opacity-100',
    ].join(' ');

    return (
      <div className="relative inline-flex flex-col">
        <label
          className={[
            'flex cursor-pointer select-none items-center gap-2',
            'has-[:disabled]:cursor-not-allowed',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className="peer sr-only"
            aria-invalid={!!error}
            aria-describedby={describedBy}
            {...rest}
          />
          <span className={boxClassName} aria-hidden>
            <svg
              viewBox="0 0 12 12"
              fill="none"
              className="h-3 w-3 opacity-0 transition-opacity"
              aria-hidden
            >
              <path
                d="M2.5 6l2.5 2.5L9.5 3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-sm font-bold text-dark">{label}</span>
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
