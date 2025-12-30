import image404src from '@/assets/Image_404.svg';
import { ImgHTMLAttributes, SyntheticEvent, useState } from 'react';

export default function Image({
  ...rest
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };
  console.log('isLoading', isLoading, 'src', rest.src);
  return (
    <div
      className='relative'
      {...(isLoading
        ? {
            style: {
              backgroundImage: `url(${rest.src})`,
              backgroundSize: rest.style?.backgroundSize || 'cover',
              backgroundPosition: rest.style?.backgroundPosition || 'center',
              backgroundRepeat: rest.style?.backgroundRepeat || 'no-repeat',
              backgroundColor: rest.style?.backgroundColor || 'transparent',
            },
          }
        : {})}
    >
      <img
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
        loading='lazy'
        {...rest}
        onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
          (e.target as HTMLImageElement).src = image404src;
        }}
        onLoad={handleLoad}
      />
    </div>
  );
}
