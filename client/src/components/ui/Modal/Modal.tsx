import { FC, MouseEvent, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  backgroundClassname?: string;
  open: boolean;
  onBackdropClick: (e: MouseEvent<HTMLDivElement>) => void;
  children?: ReactNode;
  containerClassName?: string;
  center: boolean;
};

const Modal: FC<ModalProps> = ({
  containerClassName = '',
  backgroundClassname = '',
  open,
  onBackdropClick,
  children,
}) => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    backgroundRef.current?.classList.remove('opacity-0');
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      ref={backgroundRef}
      onClick={(e) => {
        e.stopPropagation();
        onBackdropClick(e);
      }}
      className={`fixed left-0 top-0 z-20 h-dvh w-screen bg-gray-950/70 opacity-0 backdrop-blur-sm transition-opacity duration-150 ${backgroundClassname}`}
    >
      <div
        className={`absolute left-1/2 top-1/2 max-h-[90dvh] w-fit -translate-x-1/2 -translate-y-1/2 overflow-y-auto ${containerClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.getElementById('root')!,
  );
};

export default Modal;
