import { ReactNode } from 'react';
import useCarousel from './hooks/useCarousel';
interface IDataCarouselProps<T> {
  keyProperty: keyof T;
  dataArray: T[];
  singleItem: (data: T) => ReactNode;
  carouselNavigation: (
    incrementIndex: () => void,
    decrementIndex: () => void,
    data: T,
  ) => ReactNode;
}

export default function DataCarousel<T>({
  keyProperty,
  dataArray,
  singleItem,
  carouselNavigation,
}: IDataCarouselProps<T>) {
  const { currentIndex, incrementIndex, decrementIndex } = useCarousel(
    dataArray.length,
  );
  return (
    <div>
      <div
        style={{ translate: `${currentIndex * 101}% 0` }}
        className='flex gap-[1%] transition-all duration-500 ease-in-out'
      >
        {dataArray.map((item, index) => (
          <div
            key={`${item[keyProperty]}`}
            className={`aspect-video w-full shrink-0 transition-all duration-500 ease-in-out ${index !== currentIndex && 'scale-95 blur-sm'}`}
          >
            {singleItem(item)}
          </div>
        ))}
      </div>
      {carouselNavigation(
        incrementIndex,
        decrementIndex,
        dataArray[currentIndex],
      )}
    </div>
  );
}
