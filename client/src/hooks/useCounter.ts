import { useState } from 'react';

interface IUseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (value: number) => void;
}

interface IUseCounterProps {
  initialValue?: number;
  min?: number;
  max?: number;
}

export default function useCounter({
  initialValue = 0,
  min,
  max,
}: IUseCounterProps = {}): IUseCounterReturn {
  const [count, setCount] = useState(initialValue);
  const increment = () => {
    if (max === undefined) {
      setCount((prev) => prev + 1);
    } else {
      setCount((prev) => {
        return Math.min(prev + 1, max);
      });
    }
  };

  const decrement = () => {
    if (min === undefined) {
      setCount((prev) => prev - 1);
    } else {
      setCount((prev) => Math.max(prev - 1, min));
    }
  };

  const reset = () => setCount(initialValue);
  return { count, increment, decrement, reset, setCount };
}
