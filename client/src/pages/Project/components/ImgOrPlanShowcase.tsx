import { useEffect } from 'react';
import ImageClickModal from './ImageClickModal';
import useCounter from '@/hooks/useCounter';

export default function ImgOrPlansShowcase({ arr }: { arr: string[] }) {
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
  );
}
