import image404src from '@/assets/Image_404.svg';
import { ImgHTMLAttributes, SyntheticEvent, useState } from 'react';
import type { ResponsiveImage } from '@shirans/shared';

export type { ResponsiveImage } from '@shirans/shared';

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string | ResponsiveImage;
}

export default function Image({ src, ...rest }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (typeof src === 'object') {
    const responsiveSrc = src as ResponsiveImage;
    const fallbackSrc = responsiveSrc.fallback || responsiveSrc.desktop;

    return (
      <picture>
        {responsiveSrc.mobile && <source
          media='(max-width: 480px)'
          srcSet={responsiveSrc.mobile}
          type='image/webp'
        />}
        {responsiveSrc.tablet && <source
          media='(max-width: 800px)'
          srcSet={responsiveSrc.tablet}
          type='image/webp'
        />}
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