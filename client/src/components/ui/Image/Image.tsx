import image404src from '@/assets/Image_404.svg';
import { ImgHTMLAttributes, SyntheticEvent } from 'react';

export default function Image({
  className = '',
  ...rest
}: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      loading='lazy'
      className={`${className}`}
      {...rest}
      onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
        console.log((e.target as HTMLImageElement).src);

        (e.target as HTMLImageElement).src = image404src;
      }}
    />
  );
}
