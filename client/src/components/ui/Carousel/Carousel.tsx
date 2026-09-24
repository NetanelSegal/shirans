import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { CarouselButton } from '../CarouselButton';

/**
 * A native scroll-snap row with the round arrows at its edges. Swipe, trackpad
 * and keyboard scrolling all work because it is just a scroller; the arrows
 * move it one item at a time.
 *
 * Item width is the caller's: pass `itemClassName` like
 * `basis-[85%] md:basis-[calc(50%-0.75rem)]`.
 */
export function Carousel<T>({
  items,
  renderItem,
  getKey,
  itemClassName,
  label,
  className,
}: {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getKey: (item: T, index: number) => string;
  itemClassName?: string;
  /** Names the region for screen readers, e.g. "פרויקטים נבחרים". */
  label: string;
  className?: string;
}) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    // RTL: scrollLeft runs from 0 toward negative as the row advances.
    const travelled = Math.abs(el.scrollLeft);
    setCanGoBack(travelled > 4);
    setCanGoForward(travelled + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = scrollerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [update, items.length]);

  const step = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    // Forward in RTL is toward the left.
    el.scrollBy({ left: -direction * (first.offsetWidth + gap), behavior: 'smooth' });
  };

  const hasOverflow = canGoBack || canGoForward;

  return (
    <div className={cn('relative', className)} role='region' aria-roledescription='carousel' aria-label={label}>
      <ul
        ref={scrollerRef}
        onScroll={update}
        className='flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
      >
        {items.map((item, index) => (
          <li key={getKey(item, index)} className={cn('shrink-0 snap-start', itemClassName)}>
            {renderItem(item, index)}
          </li>
        ))}
      </ul>

      {hasOverflow && (
        <>
          <CarouselButton
            direction='previous'
            onClick={() => step(-1)}
            disabled={!canGoBack}
            className='absolute start-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-1/2 md:inline-flex'
          />
          <CarouselButton
            direction='next'
            onClick={() => step(1)}
            disabled={!canGoForward}
            className='absolute end-0 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:inline-flex'
          />
        </>
      )}
    </div>
  );
}
