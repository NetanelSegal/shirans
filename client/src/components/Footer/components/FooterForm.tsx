import FooterFormLabel from './FooterFormLabel';
import useFooterFormState from '../hooks/useFooterFormState';
import useInputFocus from '../hooks/useInputsFocus';
import { FormEvent } from 'react';

const inputsData: { label: string; field: string; autoComplete?: string }[] = [
  {
    label: 'שם מלא',
    field: 'name',
    autoComplete: 'name',
  },
  {
    label: 'מספר טלפון',
    field: 'phoneNumber',
    autoComplete: 'tel',
  },
  {
    label: 'כתובת מייל',
    field: 'email',
    autoComplete: 'email',
  },
  {
    label: 'במה אפשר לעזור?',
    field: 'context',
  },
];

const fieldsArray = inputsData.map((e) => e.field);

export default function FooterForm() {
  const { formState, handleInputChange } = useFooterFormState(fieldsArray);
  const { isFocused, handleInputFocus, handleInputBlur } =
    useInputFocus(fieldsArray);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formState);
    // TODO: implement email send
  };

  return (
    <form
      className='flex w-full flex-col gap-2 md:flex-row'
      onSubmit={handleFormSubmit}
    >
      <div className='flex grow flex-col gap-2'>
        {inputsData.map(({ field, label, autoComplete }, index) => {
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
                className='w-full rounded-xl p-2'
              />
            </div>
          );
        })}
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
          />
        </div>
        <button className='bg-secondary text-black' type='submit'>
          שלח
        </button>
      </div>
    </form>
  );
}
