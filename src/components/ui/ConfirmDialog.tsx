import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'تأكيد',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} isOpen={isOpen} onClose={onCancel}>
      <div className="flex items-start gap-3 mb-5">
        <div className="shrink-0 w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle size={18} className="text-red-600" />
        </div>
        <p className="text-sm text-gray-600 leading-relaxed pt-1.5">{message}</p>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
          إلغاء
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'جاري الحذف...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
