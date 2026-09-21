import { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { SiteImage } from '@/constants/siteImages';

type PhotoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'alt'> & {
  image: SiteImage;
  /** How wide the photo renders, for the browser's pick, e.g. "50vw". */
  sizes?: string;
  /** Above the fold: load now and at high priority. */
  priority?: boolean;
  alt?: string;
};

/** One of the site's own photos (constants/siteImages), responsive. */
export function Photo({
  image,
  sizes = '100vw',
  priority = false,
  alt,
  className,
  ...rest
}: PhotoProps) {
  const largest = image.sources[image.sources.length - 1];
  return (
    <img
      src={largest[1]}
      srcSet={image.sources.map(([width, url]) => `${url} ${width}w`).join(', ')}
      sizes={sizes}
      alt={alt ?? image.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding='async'
      {...(priority ? { fetchpriority: 'high' } : {})}
      className={cn('object-cover', className)}
      {...rest}
    />
  );
}
