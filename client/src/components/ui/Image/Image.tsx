import image404src from '@/assets/Image_404.svg';
import { ImgHTMLAttributes, SyntheticEvent } from 'react';

export default function Image({
  ...rest
}: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      loading='lazy'
      {...rest}
      onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
        console.log((e.target as HTMLImageElement).src);

        (e.target as HTMLImageElement).src = image404src;
      }}
    />
  );
}
