import {
  forwardRef,
  InputHTMLAttributes,
  Ref,
  TextareaHTMLAttributes,
  useId,
} from 'react';
import { cn } from '@/lib/cn';

interface FieldProps {
  label: string;
  error?: { message?: string };
  /** `dark` for a field on the navy band: same shape, stronger edge. */
  tone?: 'light' | 'dark';
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & FieldProps & { as?: 'input' };
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps & { as: 'textarea' };
type Props = InputProps | TextareaProps;

/**
 * A text field whose label sits inside it like a placeholder and moves up to
 * the edge once there's a value or focus — the quiet white field of the
 * design, without losing a real <label>.
 */
export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  ({ label, error, tone = 'light', as = 'input', className, ...props }, ref) => {
    const fallbackId = useId();
    const inputId =
      typeof props.id === 'string'
        ? props.id
        : typeof props.name === 'string'
          ? props.name
          : fallbackId;
    const errorId = `${inputId}-error`;

    const fieldClass = cn(
      'peer block w-full rounded-field border bg-surface-raised px-4 pb-2 pt-6 text-body text-ink',
      'transition-[border-color,box-shadow] duration-200 ease-out',
      'focus:outline-none focus:ring-2 focus:ring-accent/25',
      '[-webkit-tap-highlight-color:transparent]',
      error
        ? 'border-danger focus:border-danger'
        : cn(tone === 'dark' ? 'border-transparent' : 'border-line/80', 'focus:border-accent'),
      as === 'textarea' && 'min-h-28 resize-none',
      className,
    );

    const common = {
      ...props,
      id: inputId,
      placeholder: ' ',
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? errorId : undefined,
      className: fieldClass,
    };

    return (
      <div className='relative'>
        {as === 'textarea' ? (
          <textarea
            {...(common as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            ref={ref as Ref<HTMLTextAreaElement>}
          />
        ) : (
          <input
            {...(common as InputHTMLAttributes<HTMLInputElement>)}
            ref={ref as Ref<HTMLInputElement>}
          />
        )}
        <label
          htmlFor={inputId}
          className={cn(
            'pointer-events-none absolute start-4 top-4 origin-[right_top] text-body text-ink-subtle',
            'transition-[transform,color] duration-200 ease-out',
            'peer-focus:-translate-y-2.5 peer-focus:scale-[0.8] peer-focus:text-accent-strong',
            'peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:scale-[0.8]',
          )}
        >
          {label}
          {props.required && <span aria-hidden> *</span>}
        </label>
        {error?.message && (
          <span id={errorId} className='mt-1 block text-small text-danger'>
            {error.message}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
