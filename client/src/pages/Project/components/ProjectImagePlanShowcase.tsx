import { useEffect } from 'react';
import ImageClickModal from './ImageClickModal';
import useCounter from '@/hooks/useCounter';
import arrowIconSrc from '@/assets/icons/select-arrow.svg';
import Image from '@/components/Image';
import Modal from '@/components/Modal';

interface IProjectImagePlanShowcaseProps {
  arr: string[];
  containerClassname?: string;
  imageClassname?: string;
}

export default function ProjectImagePlanShowcase({
  arr,
  containerClassname = '',
  imageClassname = '',
}: IProjectImagePlanShowcaseProps) {
  const { count, reset, setCount, decrement, increment } = useCounter({
    initialValue: -1,
    max: arr.length - 1,
    min: 0,
  });

  const singleImageClassname = `aspect-video cursor-pointer border-2 border-secondary rounded-xl object-cover ${imageClassname}`;

  const handleKeyPress = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        increment();
        break;
      case 'ArrowRight':
        decrement();
        break;
      case 'Escape':
        reset();
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
      {/* arrows of images slider when open */}
      {count !== -1 && (
        <>
          <div className='px-page-all fixed left-0 top-1/2 z-30 flex w-full -translate-y-1/2 justify-between'>
            <button onClick={decrement} className='bg-primary px-3'>
              <img className='h-8' src={arrowIconSrc} alt='' />
            </button>
            <button onClick={increment} className='bg-primary px-3'>
              <img className='h-8 rotate-180' src={arrowIconSrc} alt='' />
            </button>
          </div>
        </>
      )}

      <div className={containerClassname}>
        {arr.map((item, index) => (
          <ImageClickModal
            imageClassname={`${singleImageClassname} ${arr.length % 2 == 1 ? (index + 1 === arr.length ? 'sm:basis-auto grow' : '') : ''}`} // if lenght is odd, the last image should be full width
            onClick={() => setCount(index)}
            img={item}
            key={item}
          />
        ))}
      </div>

      <Modal
        containerClassName='w-[70vw] sm:w-fit'
        open={count !== -1}
        onBackdropClick={() => reset()}
        center
      >
        <Image
          key={arr[count]}
          src={arr[count]}
          alt={`${arr[count]}`}
          className='size-full max-h-[80vh] sm:translate-y-6'
        />
        <div className='absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1 sm:translate-y-6 md:bottom-5'>
          {arr.map((_, index) => (
            <div
              className={`size-2.5 rounded-full ${index === count ? 'bg-primary' : 'bg-white'}`}
              key={index}
            ></div>
          ))}
        </div>
      </Modal>
    </>
  );
}
