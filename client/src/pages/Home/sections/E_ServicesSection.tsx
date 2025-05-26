import { motion, useInView } from 'framer-motion';
import getIcon from '@/utils/icons.utils';
import EnterAnimation from '@/components/animations/EnterAnimation';
import { useRef } from 'react';

type Service = {
  id: string;
  title: string;
  description: string;
};

const services: Service[] = [
  {
    id: 'private-construction',
    title: 'בנייה פרטית',
    description: 'רישוי מלא תכנון ואדריכלות',
  },
  {
    id: 'commercial-design',
    title: 'עיצוב מסחרי',
    description: 'אדריכלות ועיצוב פנים לחללים מסחריים',
  },
  {
    id: 'licensing',
    title: 'תהליך רישוי',
    description: 'ליווי מלא בתהליכי רישוי ולגליזציה',
  },
  {
    id: 'residential-design',
    title: 'עיצוב פנים',
    description: 'ליווי מלא לעיצוב בתים פרטיים',
  },
  {
    id: 'luxury-design',
    title: 'דירות יוקרה',
    description: 'עיצוב וליווי מלא לפנטהאוזים ודירות יוקרה',
  },
  {
    id: 'consulting',
    title: 'ייעוץ מקצועי',
    description: 'ייעוץ מקצועי בתחומי אדריכלות ועיצוב פנים',
  },
];

export type ServiceName = (typeof services)[number]['id'];

export default function E_ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isSectionInView = useInView(ref, {
    amount: 'some',
    once: true,
  });

  return (
    <section
      className='py-section-all breakout-x-padding bg-secondary'
      aria-labelledby='services-heading'
    >
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.h2
          className='mb-12 text-center text-3xl font-bold md:mb-16 md:text-4xl'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          id='services-heading'
        >
          השירותים שלי
        </motion.h2>

        <div
          ref={ref}
          className='mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
        >
          {services.map(({ description, id, title }, i) => (
            <EnterAnimation
              key={id}
              dontAnimateWhileInView
              runAnimation={isSectionInView}
              delay={i * 0.2}
            >
              <div
                key={id}
                className='flex h-full flex-col items-center rounded-xl bg-white p-6 text-center shadow-lg'
                tabIndex={0}
                aria-labelledby={`${id}-title`}
                role='article'
              >
                <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors'>
                  <img
                    width='30'
                    src={getIcon({ icon: id })}
                    alt={`${id}-icon`}
                  />
                </div>
                <h3
                  id={`${id}-title`}
                  className='mb-2 text-xl font-semibold text-gray-900'
                >
                  {title}
                </h3>
                <p className='text-gray-600'>{description}</p>
              </div>
            </EnterAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
