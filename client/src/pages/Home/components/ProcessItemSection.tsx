import { useScroll } from 'motion/react';
import { forwardRef, useEffect } from 'react';

interface IProcessItemSectionProps {
  shapeSrc: string;
  i: number;
  title: string;
  shortText: string;
  time?: {
    min: number;
    max: number;
  };
  isLeft?: boolean;
}

const ProcessItemSection = forwardRef<
  HTMLImageElement,
  IProcessItemSectionProps
>(({ shortText, title, time, isLeft, i, shapeSrc }, ref) => {
  return (
    <div
      className={`flex items-center gap-5 ${isLeft ? 'flex-row-reverse' : ''}`}
    >
      <div className='w-1/2 lg:w-2/5'>
        <div className='flex flex-col items-start gap-1 lg:flex-row lg:gap-2'>
          <h3 className='subheading font-semibold'>{title}</h3>
          {time && <ProcessItemSectionTime time={time} />}
        </div>
        <p className='paragraph'>{shortText}</p>
      </div>
      <img
        ref={ref}
        id={`${i}-${title}`}
        className='h-10 max-w-14 object-contain object-center'
        src={shapeSrc}
        alt=''
      />
    </div>
  );
});

const ProcessItemSectionTime = ({
  time,
}: {
  time: { min: number; max: number };
}) => {
  return (
    <span className='text-nowrap rounded-2xl bg-primary px-2 py-1 text-center text-sm text-white lg:mt-2'>
      {time.min} - {time.max} חודשים
    </span>
  );
};

export default ProcessItemSection;
