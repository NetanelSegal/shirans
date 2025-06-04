import { useScreenContext } from '@/contexts/ScreenProvider';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const testimonials = [
  {
    name: 'רפאל קליין',
    message: `שירן מקצוענית אמיתית - זמינה תמיד, יצירתית, עם פתרונות לכל בעיה. ליוותה אותנו בבניית בית מאפס ומעבר למצופה. ממליץ בחום!`,
  },
  {
    name: 'מיתר הארבי',
    message: `מוכשרת, מסורה ומקצועית! קלטה אותנו והצליחה לתכנן לנו בית מושלם שמדויק לנו לחלומות ולצרכים.`,
  },
];

export default function Testimonials() {
  const { screenWidth } = useScreenContext();
  const ref = useRef<HTMLDivElement>(null);
  const [totalOriginalContentWidth, setTotalOriginalContentWidth] = useState(0);

  const duplicatedTestimonials = [
    ...testimonials,
    ...testimonials,
    testimonials[0],
  ];
  useEffect(() => {
    if (ref.current) {
      let calculatedWidth = 0;
      const originalChildren = Array.from(ref.current.children).slice(
        0,
        testimonials.length,
      ) as HTMLElement[];

      originalChildren.forEach((child) => {
        const itemComputedStyle = window.getComputedStyle(child);
        const itemMarginRight = parseFloat(itemComputedStyle.marginRight) || 0;
        const itemMarginLeft = parseFloat(itemComputedStyle.marginLeft) || 0;
        calculatedWidth += child.offsetWidth + itemMarginLeft + itemMarginRight;
      });

      setTotalOriginalContentWidth(calculatedWidth);
    }
  }, [screenWidth, ref]);

  if (totalOriginalContentWidth === 0) {
    return (
      <div className='relative mt-20 flex' ref={ref}>
        {duplicatedTestimonials.map((testimonial, i) => (
          <TestimonialItem key={i} {...testimonial} />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      animate={{ x: [totalOriginalContentWidth, 0] }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
        repeatType: 'loop',
      }}
      className='relative mt-20 flex'
      style={{ width: 'fit-content' }}
    >
      {duplicatedTestimonials.map((testimonial, i) => (
        <TestimonialItem key={i} {...testimonial} />
      ))}
    </motion.div>
  );
}

interface ITestimonial {
  name: string;
  message: string;
}

const TestimonialItem = ({ name, message }: ITestimonial) => {
  return (
    <div className='relative mr-36 max-w-72 shrink-0 md:mr-64 md:max-w-64 lg:mr-96 lg:max-w-96'>
      <svg
        className='absolute -right-3 -top-3 z-0 fill-primary/10'
        width='120'
        height='86'
        viewBox='0 0 120 86'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M120 53.75C120 71.5681 105.616 86 87.8571 86H85.7143C80.9732 86 77.1429 82.1569 77.1429 77.4C77.1429 72.6431 80.9732 68.8 85.7143 68.8H87.8571C96.1339 68.8 102.857 62.0544 102.857 53.75V51.6H85.7143C76.2589 51.6 68.5714 43.8869 68.5714 34.4V17.2C68.5714 7.71313 76.2589 0 85.7143 0H102.857C112.312 0 120 7.71313 120 17.2V25.8V34.4V53.75ZM51.4286 53.75C51.4286 71.5681 37.0446 86 19.2857 86H17.1429C12.4018 86 8.57143 82.1569 8.57143 77.4C8.57143 72.6431 12.4018 68.8 17.1429 68.8H19.2857C27.5625 68.8 34.2857 62.0544 34.2857 53.75V51.6H17.1429C7.6875 51.6 0 43.8869 0 34.4V17.2C0 7.71313 7.6875 0 17.1429 0H34.2857C43.7411 0 51.4286 7.71313 51.4286 17.2V25.8V34.4V53.75Z' />
      </svg>

      <div className='z-10 flex h-full flex-col'>
        <h3>{name}</h3>
        <p>{message}</p>
        <TestimonialsStars className='mt-auto' />
      </div>

      <svg
        className='absolute -bottom-3 -left-3 z-0 fill-primary/10'
        width='120'
        height='86'
        viewBox='0 0 120 86'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M0 32.25C0 14.4319 14.3839 0 32.1429 0H34.2857C39.0268 0 42.8571 3.84312 42.8571 8.6C42.8571 13.3569 39.0268 17.2 34.2857 17.2H32.1429C23.8661 17.2 17.1429 23.9456 17.1429 32.25V34.4H34.2857C43.7411 34.4 51.4286 42.1131 51.4286 51.6V68.8C51.4286 78.2869 43.7411 86 34.2857 86H17.1429C7.6875 86 0 78.2869 0 68.8V60.2V51.6V32.25ZM68.5714 32.25C68.5714 14.4319 82.9554 0 100.714 0H102.857C107.598 0 111.429 3.84312 111.429 8.6C111.429 13.3569 107.598 17.2 102.857 17.2H100.714C92.4375 17.2 85.7143 23.9456 85.7143 32.25V34.4H102.857C112.312 34.4 120 42.1131 120 51.6V68.8C120 78.2869 112.312 86 102.857 86H85.7143C76.2589 86 68.5714 78.2869 68.5714 68.8V60.2V51.6V32.25Z' />
      </svg>
    </div>
  );
};

function TestimonialsStars({ className }: { className?: string }) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          width='24'
          height='23'
          viewBox='0 0 24 23'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M13.4477 0.780967C13.2175 0.30371 12.7311 0 12.1969 0C11.6628 0 11.1807 0.30371 10.9462 0.780967L8.15364 6.52108L1.91714 7.44088C1.39598 7.51898 0.961684 7.88343 0.800994 8.38238C0.640305 8.88133 0.770593 9.43235 1.14409 9.80114L5.66946 14.2743L4.60109 20.5958C4.51423 21.1165 4.73138 21.6458 5.16134 21.9539C5.59129 22.2619 6.16022 22.301 6.62926 22.0536L12.2013 19.0816L17.7733 22.0536C18.2424 22.301 18.8113 22.2662 19.2412 21.9539C19.6712 21.6415 19.8883 21.1165 19.8015 20.5958L18.7288 14.2743L23.2541 9.80114C23.6276 9.43235 23.7623 8.88133 23.5972 8.38238C23.4322 7.88343 23.0023 7.51898 22.4811 7.44088L16.2403 6.52108L13.4477 0.780967Z'
            fill='#FFBF00'
          />
        </svg>
      ))}
    </div>
  );
}
