import {
  forwardRef,
  InputHTMLAttributes,
  Ref,
  TextareaHTMLAttributes,
  useId,
} from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: { message?: string };
  borderColor?: string;
  labelClassName?: string;
  as?: 'input';
};

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: { message?: string };
  borderColor?: string;
  labelClassName?: string;
  as: 'textarea';
};

type Props = InputProps | TextareaProps;

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  ({ label, error, borderColor, labelClassName, as = 'input', ...props }, ref) => {
    const fallbackId = useId();
    const inputId =
      typeof props.id === 'string'
        ? props.id
        : typeof props.name === 'string'
          ? props.name
          : fallbackId;

    const commonProps = {
      ...props,
      id: inputId,
      placeholder: ' ',
      className: `peer w-full rounded-card p-2 [-webkit-tap-highlight-color:transparent] focus:outline-none focus:ring-2 focus:ring-offset-0 ${as === 'textarea' ? 'resize-none' : ''} ${error ? 'border border-danger focus:border-danger focus:ring-danger' : borderColor ? `border ${borderColor} focus:border-primary focus:ring-primary` : 'border border-line/70 focus:border-primary focus:ring-primary'
        }`,
    };

    const labelClasses =
      labelClassName ??
      'absolute start-2 z-10 top-2 rounded-field px-2 font-bold shadow-card transition-all duration-150 ease-in-out peer-focus:-translate-y-3/4 peer-focus:top-2 peer-[:not(:placeholder-shown)]:-translate-y-3/4 peer-[:not(:placeholder-shown)]:top-2 text-dark bg-surface-sunken';

    return (
      <div className="relative">
        {as === 'textarea' ? (
          <textarea
            {...(commonProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            ref={ref as Ref<HTMLTextAreaElement>}
          />
        ) : (
          <input
            {...(commonProps as InputHTMLAttributes<HTMLInputElement>)}
            ref={ref as Ref<HTMLInputElement>}
          />
        )}
        <label
          htmlFor={inputId}
          className={labelClasses}
        >
          {label}
        </label>
        {error && (
          <span className="mt-1 block text-sm text-danger">{error.message}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
