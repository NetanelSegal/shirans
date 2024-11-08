import { useState } from 'react';

const useCarousel = (
  length: number,
): {
  currentIndex: number;
  incrementIndex: () => void;
  decrementIndex: () => void;
} => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const incrementIndex = () => {
    setCurrentIndex((prevState) =>
      prevState === length - 1 ? 0 : prevState + 1,
    );
  };

  const decrementIndex = () => {
    setCurrentIndex((prevState) =>
      prevState === 0 ? length - 1 : prevState - 1,
    );
  };

  return { currentIndex, incrementIndex, decrementIndex };
};

export default useCarousel;
