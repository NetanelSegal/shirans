import { ImgHTMLAttributes } from 'react';
import Image from '../Image/Image';

interface IImageScaleHoverProps extends ImgHTMLAttributes<HTMLImageElement> {
  containerOnClick?: () => void;
  containerClassName?: string;
  src: string;
}

export default function ImageScaleHover({
  containerOnClick = () => {},
  containerClassName = '',
  ...rest
}: IImageScaleHoverProps) {
  return (
    <div
      onClick={containerOnClick}
      className={`aspect-video overflow-hidden ${containerClassName}`}
    >
      <Image
        className='size-full object-cover object-center transition-all duration-300 ease-in-out hover:scale-105'
        style={{
          willChange: 'transform',
        }}
        {...rest}
      />
    </div>
  );
}
