import { useScreenContext } from '@/contexts/ScreenProvider';
import { DependencyList, RefObject, useEffect, useRef, useState } from 'react';

export default function usePathPrecentageInView(
  parentElement: RefObject<SVGSVGElement>,
  deps: DependencyList = [],
) {
  const [pathsPrecentageInView, setPathsPrecentageInView] = useState<number[]>(
    [],
  );
  const { screenWidth } = useScreenContext();

  useEffect(() => {
    if (!parentElement.current?.children.length) return;
    const arrayOfPaths = Array.from(parentElement.current.children);
    arrayOfPaths.forEach((p) => intersectorRef.current.observe(p));
    setPathsPrecentageInView(new Array(arrayOfPaths.length).fill(0));
  }, [...deps, screenWidth]);

  useEffect(() => {
    if (intersectorRef.current) {
      intersectorRef.current.disconnect();
      intersectorRef.current = new IntersectionObserver(
        intersectionObserverCallback,
        {
          rootMargin: '200% 0px -40% 0px',
          threshold: Array.from({ length: 100 }, (_, i) => i / 100),
        },
      );
    }
  }, [screenWidth]);

  const intersectionObserverCallback = (
    entries: IntersectionObserverEntry[],
  ) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const nodesArray = Array.from(parentElement.current!.children);
      const indexOfCurrentIntersecting = nodesArray.findIndex((c) =>
        c.contains(entry.target),
      );
      const precentageInView =
        (entry.intersectionRect.height / entry.boundingClientRect.height) * 100;

      setPathsPrecentageInView((prev) => {
        const newPrev = [...prev];
        newPrev[indexOfCurrentIntersecting] = precentageInView;
        return newPrev;
      });
    });
  };

  const intersectorRef = useRef<IntersectionObserver>(
    new IntersectionObserver(intersectionObserverCallback, {
      rootMargin: '200% 0px -40% 0px',
      threshold: Array.from({ length: 100 }, (_, i) => i / 100),
    }),
  );

  return { pathsPrecentageInView };
}
