import Image from '@/components/ui/Image';

interface IImageClickModalProps {
  img: string;
  onClick?: () => void;
  imageClassname?: string;
}

export default function ImageClickModal({
  img,
  onClick = () => {},
  imageClassname = '',
}: IImageClickModalProps) {
  return (
    <Image
      onClick={onClick}
      src={img}
      alt={`${img}`}
      className={`${imageClassname}`}
    />
  );
}
