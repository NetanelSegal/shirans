import { ReactNode } from 'react';

interface IFooterFormLabel {
  isTranslateY: boolean;
  children: ReactNode;
  htmlFor?: string;
}

const FooterFormLabel = ({
  isTranslateY,
  children,
  htmlFor = '',
}: IFooterFormLabel) => (
  <label
    htmlFor={htmlFor}
    className={`absolute right-2 top-2 rounded-md bg-secondary px-2 font-bold transition-all duration-150 ease-in-out ${isTranslateY && '-top-3'}`}
  >
    {children}
  </label>
);

export default FooterFormLabel;
