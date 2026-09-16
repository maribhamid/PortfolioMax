import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-3xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Centering Wrapper: Safe min-h-full centering without negative scroll clipping */}
          <div className="min-h-full flex items-center justify-center p-3 sm:p-6 text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className={`relative w-full ${maxWidth} max-h-[86vh] flex flex-col glass-card rounded-2xl sm:rounded-3xl border border-white/20 bg-slate-900/98 dark:bg-[#0c0e17]/98 shadow-2xl z-10 overflow-hidden my-auto`}
            >
              {/* Header (Always Visible / Non-Scrolling) */}
              {title && (
                <div className="shrink-0 flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-white/5 dark:bg-black/30">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold font-display text-white tracking-tight">
                      {title}
                    </h3>
                    {subtitle && (
                      <p className="text-xs text-slate-400 mt-0.5 font-sans">{subtitle}</p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors shrink-0 cursor-pointer"
                    title="Close modal (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {!title && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors z-20 cursor-pointer"
                  title="Close modal (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-4">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
