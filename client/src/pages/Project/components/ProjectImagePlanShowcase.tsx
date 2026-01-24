import { useEffect, useRef, useState } from 'react';
import ImageClickModal from './ImageClickModal';
import useCounter from '@/hooks/useCounter';
import arrowIconSrc from '@/assets/icons/select-arrow.svg';
import Image from '@/components/ui/Image';
import type { ResponsiveImage } from '@/components/ui/Image';
import Modal from '@/components/ui/Modal';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface IProjectImagePlanShowcaseProps {
  arr: (string | ResponsiveImage)[];
  containerClassname?: string;
  imageClassname?: string;
}

// Helper function to get a unique key from image (string or ResponsiveImage)
const getImageKey = (
  image: string | ResponsiveImage,
  index: number,
): string => {
  if (typeof image === 'string') {
    return image;
  }
  // For ResponsiveImage, use desktop URL as key
  return image.desktop || `image-${index}`;
};

export default function ProjectImagePlanShowcase({
  arr,
  containerClassname = '',
  imageClassname = '',
}: IProjectImagePlanShowcaseProps) {
  const { count, reset, setCount } = useCounter({
    initialValue: -1,
    max: arr.length - 1,
    min: 0,
  });

  const singleImageClassname = `aspect-video cursor-pointer border-2 border-secondary rounded-xl object-cover ${imageClassname}`;
  const transformRef = useRef<{ resetTransform: () => void } | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const swipeStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const swipeThreshold = 50; // Minimum distance for swipe
  const swipeTimeThreshold = 300; // Maximum time for swipe (ms)

  // Wrapper functions with loop functionality
  const increment = () => {
    setCount((prev) => {
      if (prev < 0) {
        // Modal is closed, shouldn't happen but handle it
        return prev;
      }
      if (prev >= arr.length - 1) {
        // Loop to first image
        return 0;
      }
      return prev + 1;
    });
  };

  const decrement = () => {
    setCount((prev) => {
      if (prev < 0) {
        // Modal is closed, shouldn't happen but handle it
        return prev;
      }
      if (prev <= 0) {
        // Loop to last image
        return arr.length - 1;
      }
      return prev - 1;
    });
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        if (!isZoomed) {
          increment();
        }
        break;
      case 'ArrowRight':
        if (!isZoomed) {
          decrement();
        }
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
  }, [count, isZoomed]);

  // Reset zoom when image changes
  useEffect(() => {
    if (transformRef.current && count >= 0) {
      transformRef.current.resetTransform();
      setIsZoomed(false);
    }
  }, [count]);

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (transformRef.current) {
      transformRef.current.resetTransform();
      setIsZoomed(false);
    }
    increment();
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (transformRef.current) {
      transformRef.current.resetTransform();
      setIsZoomed(false);
    }
    decrement();
  };

  const handleSwipeStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (isZoomed) return; // Don't handle swipe if zoomed
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    swipeStartRef.current = {
      x: clientX,
      y: clientY,
      time: Date.now(),
    };
  };

  const handleSwipeEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (isZoomed || !swipeStartRef.current) return;

    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    const deltaX = clientX - swipeStartRef.current.x;
    const deltaY = clientY - swipeStartRef.current.y;
    const deltaTime = Date.now() - swipeStartRef.current.time;

    // Check if it's a horizontal swipe (not vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold && deltaTime < swipeTimeThreshold) {
      if (deltaX > 0) {
        // Swipe right -> next image (natural direction)
        increment();
      } else {
        // Swipe left -> previous image (natural direction)
        decrement();
      }
    }

    swipeStartRef.current = null;
  };

  if (!arr.length) {
    return <p>אין תוכן עדיין</p>;
  }

  return (
    <>
      <div className={containerClassname}>
        {arr.map((item, index) => (
          <ImageClickModal
            imageClassname={`${singleImageClassname} ${arr.length % 2 == 1 ? (index + 1 === arr.length ? 'sm:basis-auto grow' : '') : ''}`} // if length is odd, the last image should be full width
            onClick={() => setCount(index)}
            img={item}
            key={getImageKey(item, index)}
          />
        ))}
      </div>

      <Modal
        containerClassName='w-fit h-fit max-w-[90vw] max-h-[90vh]'
        open={count !== -1 && count >= 0 && count < arr.length}
        onBackdropClick={() => reset()}
        center
      >
        {count >= 0 && count < arr.length && arr[count] && (
          <div
            className='relative w-fit h-fit'
            onTouchStart={handleSwipeStart}
            onTouchEnd={handleSwipeEnd}
            onMouseDown={handleSwipeStart}
            onMouseUp={handleSwipeEnd}
          >
            {/* Arrow buttons - Desktop: overlay on sides, Mobile: overlay above with transparency */}
            {/* In RTL: left button (visually right) goes to next, right button (visually left) goes to previous */}
            <button
              onClick={handleIncrement}
              className={`
                absolute left-2 top-1/2 z-[9999] -translate-y-1/2
                rounded-full bg-primary/80 p-2 backdrop-blur-sm
                transition-all duration-200 hover:bg-primary hover:scale-110
                pointer-events-auto cursor-pointer
                sm:left-4 sm:bg-primary/90
                md:left-6
              `}
              aria-label='Next image'
            >
              <img className='h-6 w-6 rotate-180 sm:h-8 sm:w-8 pointer-events-none' src={arrowIconSrc} alt='Next' />
            </button>

            <button
              onClick={handleDecrement}
              className={`
                absolute right-2 top-1/2 z-[9999] -translate-y-1/2
                rounded-full bg-primary/80 p-2 backdrop-blur-sm
                transition-all duration-200 hover:bg-primary hover:scale-110
                pointer-events-auto cursor-pointer
                sm:right-4 sm:bg-primary/90
                md:right-6
              `}
              aria-label='Previous image'
            >
              <img className='h-6 w-6 sm:h-8 sm:w-8 pointer-events-none' src={arrowIconSrc} alt='Previous' />
            </button>

            {/* Zoom/Pan wrapper */}
            <TransformWrapper
              initialScale={1}
              minScale={1}
              maxScale={5}
              wheel={{ step: 0.1 }}
              pinch={{ step: 5 }}
              onInit={(ref) => {
                transformRef.current = ref;
              }}
              onTransformed={(_ref, state) => {
                setIsZoomed(state.scale > 1);
              }}
              doubleClick={{ disabled: true }}
              panning={{ disabled: isZoomed ? false : true }}
            >
              <TransformComponent
                wrapperClass='!w-fit !h-fit !z-0'
                contentClass='!w-fit !h-fit flex items-center justify-center'
              >
                <Image
                  key={getImageKey(arr[count], count)}
                  src={arr[count]}
                  alt={
                    typeof arr[count] === 'string' ? arr[count] : arr[count].desktop
                  }
                  className='max-h-[90vh] max-w-[90vw] w-auto h-auto object-contain rounded-xl'
                />
              </TransformComponent>
            </TransformWrapper>

            {/* Dot indicators */}
            <div className='absolute bottom-2 left-0 right-0 z-40 flex items-center justify-center gap-1 sm:bottom-4 md:bottom-6'>
              {arr.map((_, index) => (
                <div
                  className={`size-2.5 rounded-full transition-all ${index === count ? 'bg-primary' : 'bg-white/60'}`}
                  key={index}
                ></div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
