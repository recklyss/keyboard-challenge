import React, { useEffect, useRef } from 'react';

interface ModalProps {
  onClose: () => void;
  labelledBy: string;
  children: React.ReactNode;
  id?: string;
}

export const Modal: React.FC<ModalProps> = ({ onClose, labelledBy, children, id }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap
  useEffect(() => {
    const focusableSelectors = [
      'button', 'input', 'select', 'textarea'
    ];
    const modal = modalRef.current;
    if (modal) {
      const focusableEls = modal.querySelectorAll<HTMLElement>(focusableSelectors.join(','));
      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];
      if (firstEl) firstEl.focus();

      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        } else if (e.key === 'Tab') {
          if (focusableEls.length === 0) return;
          if (e.shiftKey) {
            if (document.activeElement === firstEl) {
              e.preventDefault();
              lastEl.focus();
            }
          } else {
            if (document.activeElement === lastEl) {
              e.preventDefault();
              firstEl.focus();
            }
          }
        }
      }
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [onClose]);

  return (
    <div className="modal-backdrop">
      <div
        className="modal-content"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        id={id}
      >
        {children}
      </div>
    </div>
  );
}; 