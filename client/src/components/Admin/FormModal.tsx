import { ReactNode } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
}

export function FormModal({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = 'שמור',
  cancelLabel = 'ביטול',
  isSubmitting = false,
}: FormModalProps) {
  const handleBackdropClick = () => {
    if (!isSubmitting) onClose();
  };

  return (
    <Modal
      open={open}
      onBackdropClick={handleBackdropClick}
      center
      containerClassName="w-full max-w-lg"
    >
      <form
        onSubmit={onSubmit}
        className="rounded-xl bg-white p-6 shadow-xl"
        dir="rtl"
        aria-labelledby="form-modal-title"
      >
        <h2 id="form-modal-title" className="mb-4 text-xl font-bold text-primary">
          {title}
        </h2>
        <div className="mb-6 space-y-4">{children}</div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="light"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'שומר...' : submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
