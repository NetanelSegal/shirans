import { useEffect } from 'react';
import ImageClickModal from './ImageClickModal';
import useCounter from '@/hooks/useCounter';
import arrowIconSrc from '@/assets/icons/select-arrow.svg';

export default function ProjectImagePlanShowcase({ arr }: { arr: string[] }) {
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
        <div className='px-page-all fixed left-0 top-1/2 z-30 flex w-full -translate-y-1/2 justify-between'>
          <button onClick={decrement} className='bg-primary px-3'>
            <img className='h-8' src={arrowIconSrc} alt='' />
          </button>
          <button onClick={increment} className='bg-primary px-3'>
            <img className='h-8 rotate-180' src={arrowIconSrc} alt='' />
          </button>
        </div>
      )}

      <div className='my-5 mb-10 flex w-full justify-start gap-2 overflow-x-scroll md:flex-row'>
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
