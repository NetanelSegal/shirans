import { useEffect } from 'react';
import ImageClickModal from './ImageClickModal';
import useCounter from '@/hooks/useCounter';
import arrowIconSrc from '@/assets/icons/select-arrow.svg';

interface IProjectImagePlanShowcaseProps {
  arr: string[];
}

export default function ProjectImagePlanShowcase({
  arr,
}: IProjectImagePlanShowcaseProps) {
  const { count, reset, setCount, decrement, increment } = useCounter({
    initialValue: -1,
    max: arr.length - 1,
    min: 0,
  });

  const handleKeyPress = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        increment();
        break;
      case 'ArrowRight':
        decrement();
        break;
    }
  };

  useEffect(() => {
    if (count === -1) return;
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [count]);

  if (!arr.length) {
    return <p>אין תוכן עדיין</p>;
  }
  return (
    <>
      {count !== -1 && (
        <div className='fixed left-0 right-0 top-1/2 z-30 flex -translate-y-1/2 items-center justify-between px-page-sm md:px-page-md lg:px-page-lg xl:px-page-xl'>
          <button onClick={decrement} className='bg-primary px-3'>
            <img className='h-8' src={arrowIconSrc} alt='' />
          </button>
          <button onClick={increment} className='bg-primary px-3'>
            <img className='h-8 rotate-180' src={arrowIconSrc} alt='' />
          </button>
        </div>
      )}

      <div className='my-5 mb-10 flex w-full flex-wrap justify-start gap-2 overflow-x-scroll sm:flex-nowrap md:flex-row'>
        {arr.map((item, index) => (
          <ImageClickModal
            onClick={() => setCount(index)}
            close={() => {
              reset();
            }}
            open={count === index}
            img={item}
            key={item}
          />
        ))}
      </div>
    </>
  );
}
