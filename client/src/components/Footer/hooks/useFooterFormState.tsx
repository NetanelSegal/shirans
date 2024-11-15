import { ChangeEvent, useState } from 'react';

export default function useFooterFormState(fieldsArray: string[]) {
  const [formState, setFormState] = useState<Record<string, string>>(() =>
    fieldsArray.reduce((obj, item) => ({ ...obj, [item]: '' }), {}),
  );

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return {
    formState,
    handleInputChange,
  };
}
