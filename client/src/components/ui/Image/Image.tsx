import image404src from '@/assets/Image_404.svg';
import { ImgHTMLAttributes, SyntheticEvent, useState } from 'react';

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
}

export default function Image({ src, ...rest }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <img
      style={{
        opacity: isLoading ? 0 : 1,
        transition: 'opacity 0.3s ease-in-out',
      }}
      loading='lazy'
      src={src}
      alt={rest.alt || ''}
      {...rest}
      onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
        (e.target as HTMLImageElement).src = image404src;
      }}
      onLoad={() => setIsLoading(false)}
    />
  );
}
