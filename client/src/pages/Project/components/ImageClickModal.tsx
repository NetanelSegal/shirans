import Image from '@/components/Image';
import Modal from '@/components/Modal';
interface IImageClickModalProps {
  img: string;
  open: boolean;
  close: () => void;
  onClick?: () => void;
}

export default function ImageClickModal({
  img,
  open,
  close,
  onClick = () => {},
}: IImageClickModalProps) {
  return (
    <>
      <Image
        onClick={onClick}
        key={img}
        src={img}
        alt={`${img}`}
        className='aspect-video shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 border-secondary object-cover sm:basis-[32%]'
      />
      <Modal
        containerClassName='sm:w-4/5 w-[90vw]  md:w-4/6'
        open={open}
        onBackdropClick={close}
        center
      >
        <Image
          key={img}
          src={img}
          alt={`${img}`}
          className='size-full max-h-[80vh] rounded-xl border-2 border-secondary object-cover'
        />
      </Modal>
    </>
  );
}
