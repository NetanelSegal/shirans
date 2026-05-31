import { useRef } from 'react';
import { useInView } from 'motion/react';
import EnterAnimation from '@/components/animations/EnterAnimation';
import { aboutServices } from '@/data/about-content';

export default function AboutServicesSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isGridInView = useInView(gridRef, { amount: 'some', once: true });

  return (
    <section
      aria-labelledby="about-services-heading"
      className="py-section-all"
    >
      <h2
        id="about-services-heading"
        className="heading mb-12 text-center font-semibold"
      >
        {aboutServices.title}
      </h2>

      <div
        ref={gridRef}
        className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[#D4C4B8]"
      >
        <div className="grid grid-cols-2 gap-px md:grid-cols-4 bg-[#D4C4B8]">
          {aboutServices.items.map(({ id, icon, title }, i) => (
            <EnterAnimation
              key={id}
              dontAnimateWhileInView
              runAnimation={isGridInView}
              delay={i * 0.1}

            >
              <div className="flex h-full flex-col items-center justify-center bg-white p-6 text-center md:p-8">
                <div className="mb-3 flex h-14 w-14 items-center justify-center">
                  <i
                    className={`fa-solid ${icon} text-2xl text-[#B5967A]`}
                    aria-hidden
                  />
                </div>
                <p className="text-sm font-medium text-primary md:text-base">
                  {title}
                </p>
              </div>
            </EnterAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
