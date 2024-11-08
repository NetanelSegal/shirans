import image404src from '@/assets/Image_404.svg';
import { ImgHTMLAttributes, SyntheticEvent } from 'react';

export default function Image({
  ...rest
}: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      {...rest}
      onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
        (e.target as HTMLImageElement).src = image404src;
      }}
    />
  );
}
