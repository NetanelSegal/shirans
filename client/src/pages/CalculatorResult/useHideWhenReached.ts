import { useEffect, useState } from 'react';

/**
 * True until the referenced element has been reached, then false for the rest of
 * the page.
 *
 * A plain "is it on screen" check isn't enough: once the visitor scrolls past
 * the element it stops intersecting again, and anything keyed to it would come
 * back — over the footer, where it is just as redundant. The element's own top
 * tells the two cases apart.
 */
export function useHideWhenReached(
  ref: React.RefObject<HTMLElement | null>,
): boolean {
  const [reached, setReached] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(([entry]) => {
      setReached(entry.isIntersecting || entry.boundingClientRect.top < 0);
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, [ref]);

  return !reached;
}
