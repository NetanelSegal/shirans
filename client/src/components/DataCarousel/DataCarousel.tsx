import { ReactNode, useRef } from 'react';
import useCarousel from './hooks/useCarousel';

interface IDataCarouselProps<T> {
  keyProperty: keyof T;
  dataArray: T[];
  animationDuration?: number;
  singleItem: (
    data: T,
    index: number,
    incrementIndex: () => void,
    decrementIndex: () => void,
  ) => ReactNode;

  carouselNavigation: (
    data: T,
    incrementIndex: () => void,
    decrementIndex: () => void,
  ) => ReactNode;
}

export default function DataCarousel<T>({
  keyProperty,
  dataArray,
  animationDuration = 500,
  singleItem,
  carouselNavigation,
}: IDataCarouselProps<T>) {
  const ref = useRef<HTMLDivElement>(null);

  const {
    displayedData,
    currentIndex,
    incrementIndex,
    decrementIndex,
    NUMBER_OF_PLACEHOLDERS,
  } = useCarousel<T>(dataArray, keyProperty, animationDuration, ref);

  const translatePrecent = currentIndex * (100 + 1);

  return (
    <div className={`w-full`}>
      <div
        ref={ref}
        style={{
          translate: `${translatePrecent}% 0`,
          transitionDuration: `${animationDuration}ms`,
        }}
        className={`flex gap-[1%] transition-all ease-in-out`}
      >
        {displayedData.map((item, index) => (
          <div
            key={`${item[keyProperty]}`}
            className={`aspect-video w-full shrink-0 transition-all duration-[${animationDuration}ms] ease-in-out ${index !== currentIndex && 'scale-95 blur-sm'}`}
          >
            {singleItem(
              item,
              index - NUMBER_OF_PLACEHOLDERS,
              incrementIndex,
              decrementIndex,
            )}
          </div>
        ))}
      </div>
      {carouselNavigation(
        displayedData[currentIndex],
        incrementIndex,
        decrementIndex,
      )}
    </div>
  );
}
