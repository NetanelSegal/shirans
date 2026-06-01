import image404src from '@/assets/Image_404.svg';
import {
  ImgHTMLAttributes,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';

export interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  fadeIn?: boolean;
}

const DEFAULT_WIDTH = 1600;
const DEFAULT_HEIGHT = 900;

export default function Image({
  src,
  width,
  height,
  fadeIn = true,
  style,
  ...rest
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [src]);

  const showFade = fadeIn && isLoading;

  return (
    <img
      style={{
        ...style,
        opacity: showFade ? 0 : 1,
        transition: fadeIn ? 'opacity 0.3s ease-in-out' : undefined,
      }}
      loading='lazy'
      src={src}
      width={width ?? DEFAULT_WIDTH}
      height={height ?? DEFAULT_HEIGHT}
      alt={rest.alt || ''}
      {...rest}
      onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
        (e.target as HTMLImageElement).src = image404src;
      }}
      onLoad={() => setIsLoading(false)}
    />
  );
}
