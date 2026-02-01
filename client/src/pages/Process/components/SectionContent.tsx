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
        className={`relative flex w-full flex-col gap-1 rounded-2xl p-5 shadow-lg backdrop-blur-sm md:w-2/3 xl:w-1/2 ${i % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}
      >
        <div className='absolute inset-0 -z-10 rounded-2xl bg-secondary opacity-50'></div>
        <h3 className='subheading font-semibold'>{heading}</h3>
        <p className='paragraph'>{createParagraphWithBold(paragraph)}</p>
      </div>

      {/* svg container */}
      <div
        className={`-z-20 size-full lg:-mt-24 lg:w-3/4 ${i % 2 !== 0 ? 'ml-auto' : 'mr-auto'}`}
      >
        {svg}
      </div>
    </div>
  );
}

const createParagraphWithBold = (p: string) => {
  return p.split(/(\*\*.*?\*\*)/).map((word) => {
    word = word.trim();
    if (word.startsWith('**')) {
      return (
        <span key={word} className='font-semibold text-primary'>
          {' '}
          {word.slice(2, -2)}{' '}
        </span>
      );
    }
    return word;
  });
};
