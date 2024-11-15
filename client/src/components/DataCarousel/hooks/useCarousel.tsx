import { RefObject, useEffect, useState } from 'react';

const NUMBER_OF_PLACEHOLDERS = 2;

interface IUseCarouselReturn<T> {
  displayedData: T[];
  currentIndex: number;
  incrementIndex: () => void;
  decrementIndex: () => void;
  NUMBER_OF_PLACEHOLDERS: number;
}

function useCarousel<T>(
  dataArray: T[],
  keyProperty: keyof T,
  animationDuration: number,
  ref: RefObject<HTMLDivElement>,
): IUseCarouselReturn<T> {
  const [currentIndex, setCurrentIndex] = useState(NUMBER_OF_PLACEHOLDERS);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const incrementIndex = () => {
    if (isTransitioning) return;
    setCurrentIndex((prevState) => prevState + 1);
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
    }, animationDuration);
  };

  const decrementIndex = () => {
    if (isTransitioning) return;
    setCurrentIndex((prevState) => prevState - 1);
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
    }, animationDuration);
  };

  const displayedData = [
    ...dataArray.slice(-NUMBER_OF_PLACEHOLDERS).map((e) => ({
      ...e,
      [keyProperty]: `placeholder-${e[keyProperty]}`,
    })),
    ...dataArray,
    ...dataArray.slice(0, NUMBER_OF_PLACEHOLDERS).map((e) => ({
      ...e,
      [keyProperty]: `${e[keyProperty]}-placeholder`,
    })),
  ];

  useEffect(() => {
    if (currentIndex >= displayedData.length - NUMBER_OF_PLACEHOLDERS) {
      setTimeout(() => {
        setIsTransitioning(true);
        setCurrentIndex(NUMBER_OF_PLACEHOLDERS);
        setTransitionDurationToRefAndChildren(ref, 0);

        setTimeout(() => {
          setTransitionDurationToRefAndChildren(ref, animationDuration);
          setIsTransitioning(false);
        }, 10);
      }, animationDuration);
    }

    if (currentIndex <= NUMBER_OF_PLACEHOLDERS - 1) {
      setTimeout(() => {
        setIsTransitioning(true);
        setCurrentIndex(displayedData.length - 1 - NUMBER_OF_PLACEHOLDERS);
        setTransitionDurationToRefAndChildren(ref, 0);

        setTimeout(() => {
          setTransitionDurationToRefAndChildren(ref, animationDuration);
          setIsTransitioning(false);
        }, 10);
      }, animationDuration);
    }
  }, [currentIndex]);

  return {
    displayedData,
    currentIndex,
    incrementIndex,
    decrementIndex,
    NUMBER_OF_PLACEHOLDERS,
  };
}

export default useCarousel;

const setTransitionDurationToRefAndChildren = (
  ref: RefObject<HTMLDivElement>,
  duration: number,
) => {
  if (ref.current === null) {
    throw new Error('ref.current is null');
  }

  ref.current.style.transitionDuration = `${duration}ms`;

  for (let i = 0; i < ref.current.children.length; i++) {
    const child = ref.current.children[i] as HTMLElement;
    child.style.transitionDuration = `${duration}ms`;
  }
};
