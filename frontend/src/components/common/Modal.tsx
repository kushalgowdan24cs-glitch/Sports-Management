import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showClose?: boolean;
  footer?: React.ReactNode;
}

const sizeClasses = {
  sm:  'max-w-sm',
  md:  'max-w-md',
  lg:  'max-w-lg',
  xl:  'max-w-xl',
  '2xl': 'max-w-2xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
  footer,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Modal */}
      <div className={clsx(
        'relative w-full bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl',
        'animate-slide-up flex flex-col max-h-[90vh]',
        sizeClasses[size],
      )}>
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-dark-700 shrink-0">
            {title && (
              <h2 className="text-lg font-semibold text-white">{title}</h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors ml-auto"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {children}
        </div>
        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-dark-700 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
