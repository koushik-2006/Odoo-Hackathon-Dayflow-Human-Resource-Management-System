import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'max-w-lg',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Dark Blur Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Centered Modal Window Dialog */}
      <div
        className={`relative w-full ${maxWidth} max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-10 flex flex-col overflow-hidden transition-all transform animate-fade-in my-auto`}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-800/80 shrink-0 bg-slate-900/90">
          <div>
            {title && (
              <h3 className="text-lg font-bold text-slate-100 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable fields area) */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 min-h-0 custom-scrollbar space-y-4">
          {children}
        </div>

        {/* Modal Sticky Footer (Always visible Save & Cancel buttons) */}
        {footer && (
          <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/80 shrink-0 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
