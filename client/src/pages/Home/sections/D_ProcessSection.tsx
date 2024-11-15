import { content } from '@/data/process-info.ts';
import ProcessItemSection from '../components/ProcessItemSection.tsx';
import { Fragment, useRef } from 'react';

import AnimatedProcessSectionPath from '../components/AnimatedProcessSectionPath.tsx';
import useGetProcessCenters from '../hooks/useGetProcessCenters.tsx';
import usePathPrecatgentInView from '../hooks/usePathPrecatgentInView.tsx';

export default function D_ProcessSection() {
  const shapesRefs = useRef<HTMLDivElement[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { centers } = useGetProcessCenters(shapesRefs.current, sectionRef);
  const { pathsPrecentInView } = usePathPrecatgentInView(svgRef, [centers]);

  return (
    <section ref={sectionRef} className='py-section-all relative'>
      {content.map((section, index) => (
        <Fragment key={section.title}>
          <ProcessItemSection
            i={index}
            {...section}
            key={section.title}
            isLeft={index % 2 !== 0}
            ref={(ref) => {
              if (ref) {
                shapesRefs.current[index] = ref;
              }
            }}
          />
          {index === content.length - 1 && (
            <button className='mt-2 bg-primary'>עוד על התהליך</button>
          )}
        </Fragment>
      ))}
      <svg ref={svgRef} className='absolute top-0 -z-10 size-full'>
        {centers.map((c, i) => {
          return i === centers.length - 1 ? null : (
            <AnimatedProcessSectionPath
              key={c.y}
              startPoint={c}
              endPoint={centers[i + 1]}
              strokeDashoffsetPercentage={pathsPrecentInView[i] || 0}
            />
          );
        })}
      </svg>
    </section>
  );
}
