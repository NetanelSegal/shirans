import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'אישור',
  cancelLabel = 'ביטול',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  const handleBackdropClick = () => {
    if (!isLoading) onClose();
  };

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal
      open={open}
      onBackdropClick={handleBackdropClick}
      center
      containerClassName="w-full max-w-md"
    >
      <div
        className="rounded-card bg-surface-raised p-6 shadow-raised"
        dir="rtl"
        role="alertdialog"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
      >
        <h2
          id="confirm-dialog-title"
          className="mb-2 text-xl font-bold text-ink"
        >
          {title}
        </h2>
        <p id="confirm-dialog-message" className="mb-6 text-ink-muted">
          {message}
        </p>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="quiet"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'מעבד...' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
