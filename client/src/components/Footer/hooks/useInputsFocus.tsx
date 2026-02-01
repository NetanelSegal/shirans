import { ChangeEvent, useState } from 'react';

export default function useInputsFocus(fieldsArray: string[]) {
  const [isFocused, setIsFocused] = useState<Record<string, boolean>>(
    fieldsArray.reduce((obj, item) => ({ ...obj, [item]: false }), {}),
  );
  const handleInputFocus = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => setIsFocused((prev) => ({ ...prev, [e.target.name]: true }));

  const handleInputBlur = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => setIsFocused((prev) => ({ ...prev, [e.target.name]: false }));
  return { handleInputFocus, handleInputBlur, isFocused };
}
