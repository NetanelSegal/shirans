// src/components/FeedbackCarousel/FeedbackCarousel.tsx
import { useEffect, useRef, useState } from 'react';

export interface FeedbackItem {
  id: string | number;
  name: string;
  message: string;
  role?: string;
}

interface FeedbackCarouselProps {
  feedbacks: FeedbackItem[];
  speed?: number;
  className?: string;
}

const FeedbackCarousel = ({
  feedbacks,
  speed = 20,
  className = '',
}: FeedbackCarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [duplicatedFeedbacks, setDuplicatedFeedbacks] = useState<
    FeedbackItem[]
  >([]);

  // Duplicate feedbacks to create seamless infinite scroll
  useEffect(() => {
    if (feedbacks.length > 0) {
      setDuplicatedFeedbacks([...feedbacks, ...feedbacks, ...feedbacks]);
    }
  }, [feedbacks]);

  // Animation loop
  useEffect(() => {
    if (!containerRef.current || isPaused || duplicatedFeedbacks.length === 0)
      return;

    const container = containerRef.current;
    let animationFrame: number;
    let position = 0;

    const animate = () => {
      if (!container) return;

      // Reset position when scrolled one full width
      if (position <= -container.scrollWidth / 3) {
        position = 0;
        container.style.transform = `translateX(0)`;
      }

      position -= 0.5; // Adjust speed here
      container.style.transform = `translateX(${position}px)`;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [duplicatedFeedbacks.length, isPaused]);

  if (feedbacks.length === 0) return null;

  return (
    <section
      className={`relative overflow-hidden bg-primary py-16 ${className}`}
    >
      <div className='container mx-auto px-4'>
        <h2 className='mb-12 text-center text-3xl font-bold text-white'>
          מה אומרים עלינו
        </h2>
      </div>

      <div className='relative'>
        {/* Left gradient overlay */}
        <div className='absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-primary to-transparent' />

        {/* Right gradient overlay */}
        <div className='absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-primary to-transparent' />

        <div
          ref={containerRef}
          className='flex w-max items-stretch gap-8 px-8'
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {duplicatedFeedbacks.map((feedback, index) => (
            <div
              key={`${feedback.id}-${index}`}
              className='w-80 flex-shrink-0 rounded-lg bg-white p-8 shadow-md md:w-96'
            >
              <div className='mb-4 text-4xl text-gray-200'>"</div>
              <p className='mb-6 text-gray-700'>{feedback.message}</p>
              <div>
                <p className='font-medium text-gray-900'>{feedback.name}</p>
                {feedback.role && (
                  <p className='text-sm text-gray-500'>{feedback.role}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeedbackCarousel;
