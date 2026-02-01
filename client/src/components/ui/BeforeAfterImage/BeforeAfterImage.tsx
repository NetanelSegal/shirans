import { ImgHTMLAttributes, useEffect, useRef, useState } from 'react';
import Image from '../Image/Image';

interface IBeforeAfterImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  beforeSrc: string;
  afterSrc: string;
  containerClassName?: string;
  sliderColor?: string;
  initialPosition?: number; // 0-100, default 50
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterImage({
  beforeSrc,
  afterSrc,
  containerClassName = 'aspect-video',
  sliderColor = '#ffffff',
  initialPosition = 50,
  alt = 'Before and after comparison',
  beforeLabel = 'לפני',
  afterLabel = 'אחרי',
  ...rest
}: IBeforeAfterImageProps) {
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = () => {
    isDragging.current = true;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  const updateSliderPosition = (clientX: number) => {
    if (!containerRef.current || !isDragging.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    if (clientX < containerRect.left) {
      setSliderPosition(0);
      return;
    }

    if (clientX > containerRect.right) {
      setSliderPosition(100);
      return;
    }

    const x = clientX - containerRect.left;
    const containerWidth = containerRect.width;

    // Calculate position as percentage (0-100)
    let newPosition = (x / containerWidth) * 100;

    // Clamp position between 0 and 100
    newPosition = Math.max(0, Math.min(100, newPosition));

    setSliderPosition(newPosition);
  };

  const handleMouseMove = (e: MouseEvent) => {
    updateSliderPosition(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      updateSliderPosition(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      isDragging.current = false;
    };
  }, []);

  return (
    <div
      dir='ltr'
      ref={containerRef}
      className={`relative ${containerClassName}`}
      {...rest}
    >
      {/* After image (bottom layer) */}
      <div className='absolute inset-0'>
        <Image
          src={afterSrc}
          alt={`${alt} - after`}
          className='h-full w-full object-cover object-center'
        />
        {/* After label */}
        <div className='absolute bottom-2 right-2 z-50 bg-black/50 px-2 py-1 text-xs text-white'>
          {afterLabel}
        </div>
      </div>

      {/* Before image (top layer with clip) */}
      <div
        className='absolute inset-0'
        style={{
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
        }}
      >
        <Image
          src={beforeSrc}
          alt={`${alt} - before`}
          className='h-full w-full object-cover object-center'
        />
        {/* Before label */}
        <div className='absolute bottom-2 left-2 z-50 bg-black/50 px-2 py-1 text-xs text-white'>
          {beforeLabel}
        </div>
      </div>

      {/* Slider control */}
      <div
        className='absolute inset-y-0 z-10'
        style={{
          left: `calc(${sliderPosition}% - 1px)`,
          width: '2px',
          backgroundColor: sliderColor,
        }}
      >
        {/* Slider handle */}
        <div
          className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize select-none'
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div
            className='flex h-10 w-10 items-center justify-center rounded-full shadow-md'
            style={{ backgroundColor: sliderColor }}
          >
            <div className='flex items-center justify-center gap-[2px]'>
              <div className='h-4 w-[1px] bg-gray-500'></div>
              <div className='h-4 w-[1px] bg-gray-500'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
