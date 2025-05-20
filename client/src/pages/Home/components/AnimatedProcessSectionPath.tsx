import { useEffect, useRef, useState } from 'react';

interface IAnimatedProcessPathProps {
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  strokeDashoffsetPercentage: number;
}

const AnimatedProcessSectionPath = ({
  startPoint,
  endPoint,
  strokeDashoffsetPercentage,
}: IAnimatedProcessPathProps) => {
  const pathRef = useRef<SVGPolylineElement>(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, []);

  const controlPoint1 = { x: startPoint.x + 0, y: startPoint.y + 60 };
  const controlPoint2 = { x: endPoint.x + 0, y: endPoint.y - 60 };
  const initialPathData = `M${startPoint.x} ${startPoint.y} C${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x}  ${controlPoint2.y}, ${endPoint.x} ${endPoint.y}`;
  const strokeDashoffset =
    pathLength - pathLength * (strokeDashoffsetPercentage / 100);

  return (
    <g>
      <mask id={`mask-${startPoint.y}`}>
        <path
          ref={pathRef}
          className='transition-all duration-500'
          d={initialPathData}
          stroke={`white`}
          strokeWidth='4'
          strokeDashoffset={strokeDashoffset}
          strokeDasharray={pathLength}
          fill='none'
          strokeLinecap='round'
        />
      </mask>
      <path
        className='stroke-secondary'
        d={initialPathData}
        strokeWidth='4'
        strokeDasharray={'10'}
        fill='none'
        strokeLinecap='round'
      />
      <path
        d={initialPathData}
        className='stroke-primary'
        strokeWidth='3'
        strokeDasharray={'10'}
        fill='none'
        strokeLinecap='round'
        mask={`url(#mask-${startPoint.y})`}
      />
    </g>
  );
};

export default AnimatedProcessSectionPath;
