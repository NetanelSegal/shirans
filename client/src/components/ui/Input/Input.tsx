import { forwardRef, InputHTMLAttributes, Ref, TextareaHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: { message?: string };
  borderColor?: string;
  as?: 'input';
};

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: { message?: string };
  borderColor?: string;
  as: 'textarea';
};

type Props = InputProps | TextareaProps;

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  ({ label, error, borderColor, as = 'input', ...props }, ref) => {
    const commonProps = {
      ...props,
      placeholder: ' ',
      className: `peer w-full rounded-xl p-2 [-webkit-tap-highlight-color:transparent] focus:outline-none focus:ring-2 focus:ring-offset-0 ${as === 'textarea' ? 'resize-none' : ''} ${error ? 'border border-red-500 focus:border-red-500 focus:ring-red-500' : borderColor ? `border ${borderColor} focus:border-primary focus:ring-primary` : 'border border-gray-200 focus:border-primary focus:ring-primary'
        }`,
    };

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
          htmlFor={props.id ?? props.name}
          className='absolute start-2 z-10 top-2 rounded-md px-2 font-bold shadow-md transition-all duration-150 ease-in-out peer-focus:-translate-y-3/4 peer-focus:top-2 peer-[:not(:placeholder-shown)]:-translate-y-3/4 peer-[:not(:placeholder-shown)]:top-2 text-dark bg-secondary'
        >
          {label}
        </label>
        {error && (
          <span className="mt-1 text-sm text-red-500">{error.message}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
