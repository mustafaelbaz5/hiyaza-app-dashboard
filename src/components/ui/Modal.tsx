import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-fade-in'
      onClick={onClose}>
      <div
        className='bg-white rounded-2xl shadow-popover w-full max-w-md p-6'
        onClick={(e) => e.stopPropagation()}>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-base font-semibold text-gray-900'>{title}</h3>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-colors'>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
