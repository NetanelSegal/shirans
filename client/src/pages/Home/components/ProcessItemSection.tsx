import { forwardRef } from 'react';

interface IProcessItemSectionProps {
  i: number;
  title: string;
  shortText: string;
  time?: {
    min: number;
    max: number;
  };
  isLeft?: boolean;
}

const ProcessItemSection = forwardRef<HTMLDivElement, IProcessItemSectionProps>(
  ({ shortText, title, time, isLeft, i }, ref) => {
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
        <div
          ref={ref}
          id={`${i}-${title}`}
          className='size-10 rounded-full bg-secondary'
        >
          {/* TODO add shape for each item */}
        </div>
      </div>
    );
  },
);

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
