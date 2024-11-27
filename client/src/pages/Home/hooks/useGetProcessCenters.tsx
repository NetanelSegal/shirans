import { useScreenContext } from '@/contexts/ScreenProvider';
import { getCenterOfElementInContainer } from '@/utils/functions.utils';
import { RefObject, useEffect, useState } from 'react';

export default function useGetProcessCenters(
  shapesRef: HTMLDivElement[],
  sectionRef: RefObject<HTMLDivElement>,
) {
  const { screenWidth } = useScreenContext();

  const [centers, setCenters] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    setTimeout(() => {
      if (sectionRef.current) {
        const computedCenters = shapesRef.map((r) =>
          getCenterOfElementInContainer(r, sectionRef.current!),
        );

        setCenters(computedCenters);
      }
    }, 50);
  }, []);

  useEffect(() => {
    if (sectionRef.current) {
      const computedCenters = shapesRef.map((r) =>
        getCenterOfElementInContainer(r, sectionRef.current!),
      );

      setCenters(computedCenters);
    }
  }, [screenWidth]);
  return { centers };
}
