import Image from '@/components/ui/Image';
import type { ResponsiveImage } from '@shirans/shared';

interface IImageClickModalProps {
  img: string | ResponsiveImage;
  onClick?: () => void;
  imageClassname?: string;
}

export default function ImageClickModal({
  img,
  onClick = () => {},
  imageClassname = '',
}: IImageClickModalProps) {
  const altText = typeof img === 'string' ? img : img.desktop;
  
  return (
    <Image
      onClick={onClick}
      src={img}
      alt={altText}
      className={`${imageClassname}`}
    />
  );
}
