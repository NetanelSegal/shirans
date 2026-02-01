import FooterFormLabel from './FooterFormLabel';
import useFooterFormState from '../hooks/useFooterFormState';
import useInputFocus from '../hooks/useInputsFocus';
import { AllHTMLAttributes, FormEvent } from 'react';
import useEmailSend from '../hooks/useEmailSend';

interface IInputsData {
  label: string;
  field: string;
  type: AllHTMLAttributes<HTMLInputElement>['type'];
  validate?: {
    min?: number;
    max?: number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
  };
  autoComplete?: string;
}

const inputsData: IInputsData[] = [
  {
    label: 'שם מלא',
    field: 'name',
    type: 'text',
    autoComplete: 'name',
    validate: { minLength: 2, maxLength: 50, required: true },
  },
  {
    label: 'מספר טלפון',
    field: 'phoneNumber',
    type: 'tel',
    autoComplete: 'tel',
    validate: { minLength: 10, maxLength: 10, required: true },
  },
  {
    label: 'כתובת מייל',
    field: 'email',
    autoComplete: 'email',
    type: 'email',
    validate: { minLength: 5, maxLength: 50, required: true },
  },
  {
    label: 'הערות',
    field: 'context',
    type: 'text',
    // validate: { minLength: 2, maxLength: 200, required: true },
  },
];
const fieldsArray = inputsData.map((e) => e.field);

export default function FooterForm() {
  const { formState, handleInputChange } = useFooterFormState(fieldsArray);
  const { isFocused, handleInputFocus, handleInputBlur } =
    useInputFocus(fieldsArray);
  const { error, sendEmail, loading, success } = useEmailSend();

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendEmail(formState);
  };

  return (
    <form
      className='flex w-full flex-col gap-2 md:flex-row'
      onSubmit={handleFormSubmit}
    >
      <div className='flex grow flex-col gap-2'>
        {inputsData.map(
          ({ field, label, autoComplete, type, validate }, index) => {
            if (index === inputsData.length - 1) return null;
            return (
              <div key={field} className='relative'>
                <FooterFormLabel
                  isTranslateY={isFocused[field] || formState[field] !== ''}
                  htmlFor={field}
                >
                  {label}
                </FooterFormLabel>
                <input
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onChange={handleInputChange}
                  id={field}
                  autoComplete={autoComplete}
                  name={field}
                  type={type}
                  className='w-full rounded-xl p-2'
                  {...validate}
                />
              </div>
            );
          },
        )}
      </div>

      <div className='flex grow flex-col md:gap-2'>
        <div className='relative'>
          <FooterFormLabel
            isTranslateY={
              isFocused[fieldsArray[fieldsArray.length - 1]] ||
              formState[fieldsArray[fieldsArray.length - 1]] !== ''
            }
          >
            {inputsData[inputsData.length - 1].label}
          </FooterFormLabel>
          <textarea
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            rows={5}
            name={fieldsArray[fieldsArray.length - 1]}
            className='size-full resize-none rounded-xl p-2'
            {...inputsData[inputsData.length - 1].validate}
          />
        </div>
        <button
          className={`bg-secondary text-black ${error && 'bg-red-500'} ${success && 'bg-green-500'}`}
          type='submit'
        >
          {!loading && !error && !success && 'שלח'}
          {loading && 'שולח מייל'}
          {success && 'ההודעה נשלחה בהצלחה'}
          {error}
        </button>
      </div>
    </form>
  );
}
