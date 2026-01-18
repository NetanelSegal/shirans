import { ImgHTMLAttributes } from 'react';
import Image, { ResponsiveImage } from '../Image/Image';

interface IImageScaleHoverProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  containerOnClick?: () => void;
  containerClassName?: string;
  src: string | ResponsiveImage;
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
