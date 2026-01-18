import image404src from '@/assets/Image_404.svg';
import { ImgHTMLAttributes, SyntheticEvent, useState } from 'react';

export interface ResponsiveImage {
  mobile: string;
  tablet: string;
  desktop: string;
  fallback?: string;
}

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string | ResponsiveImage;
}

export default function Image({ src, ...rest }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  // אם src הוא אובייקט responsive
  if (typeof src === 'object' && 'mobile' in src) {
    const responsiveSrc = src as ResponsiveImage;
    const fallbackSrc = responsiveSrc.fallback || responsiveSrc.desktop;

    return (
      <picture>
        <source
          media='(max-width: 480px)'
          srcSet={responsiveSrc.mobile}
          type='image/webp'
        />
        <source
          media='(max-width: 800px)'
          srcSet={responsiveSrc.tablet}
          type='image/webp'
        />
        <source srcSet={responsiveSrc.desktop} type='image/webp' />
        <img
          style={{
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
          }}
          loading='lazy'
          src={fallbackSrc}
          alt={rest.alt || ''}
          {...rest}
          onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
            (e.target as HTMLImageElement).src = image404src;
          }}
          onLoad={handleLoad}
        />
      </picture>
    );
  }

  // אם src הוא string רגיל (תאימות לאחור)
  return (
    <img
      style={{
        opacity: isLoading ? 0 : 1,
        transition: 'opacity 0.3s ease-in-out',
      }}
      loading='lazy'
      src={src as string}
      alt={rest.alt || ''}
      {...rest}
      onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
        (e.target as HTMLImageElement).src = image404src;
      }}
      onLoad={handleLoad}
    />
  );
}
