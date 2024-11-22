import {
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  useRef,
  useState,
} from 'react';

const ClickToCopy = ({ children }: { children: ReactNode }) => {
  const [isHover, setIsHover] = useState<boolean>();
  const tooltipRef = useRef<HTMLSpanElement>(null);

  const copyText = (e: MouseEvent<HTMLSpanElement>) => {
    navigator.clipboard.writeText((e.target as HTMLSpanElement).innerText);
    tooltipRef.current!.innerText = 'הועתק!';
  };

  return (
    <>
      <span
        className='relative cursor-pointer'
        onMouseLeave={() => {
          setIsHover(false);
        }}
        onMouseEnter={() => {
          setIsHover(true);
        }}
        onClick={copyText}
      >
        {children}
        {isHover && (
          <span
            dir='rtl'
            ref={tooltipRef}
            className='absolute left-full top-1/2 ml-2 w-max -translate-y-1/2 rounded-lg bg-secondary px-4 py-2 font-semibold'
          >
            לחץ להעתקה
          </span>
        )}
      </span>
    </>
  );
};

export default ClickToCopy;
