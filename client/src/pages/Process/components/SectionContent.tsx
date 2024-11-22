import { ReactNode } from 'react';

interface ISectionContentProps {
  heading: string;
  paragraph: string;
  svg: ReactNode;
  i: number;
}

export default function SectionContent({
  heading = 'default heading',
  paragraph = 'default paragraph',
  svg = <></>,
  i,
}: ISectionContentProps) {
  return (
    <div
      className={`relative flex flex-col items-center justify-between gap-5`}
    >
      {/* text container */}
      <div
        className={`relative flex w-full flex-col gap-1 rounded-2xl p-5 shadow-sm backdrop-blur-sm md:w-2/3 xl:w-1/3 ${i % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}
      >
        <div className='absolute inset-0 -z-10 rounded-2xl bg-secondary opacity-50'></div>
        <h3 className='subheading font-semibold'>{heading}</h3>
        <p className='paragraph'>{paragraph}</p>
      </div>
      <div
        className={`-z-20 size-full lg:-mt-24 lg:w-3/4 ${i % 2 !== 0 ? 'ml-auto' : 'mr-auto'}`}
      >
        {svg}
      </div>
    </div>
  );
}
