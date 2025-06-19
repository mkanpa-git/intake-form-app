import React from 'react';
// import styles from './Modal.module.css'; // Removed CSS Module import - likely redundant

export default function Modal({
  children,
  onClose,
  isOpen, // Added isOpen prop to control visibility via class
  title,  // Added title prop for the modal header
  footerContent // Optional prop for custom footer buttons/content
}) {
  if (!isOpen) {
    return null; // Don't render if not open
  }

  const handleBackdropClick = (e) => {
    // Close modal only if click is directly on the backdrop
    if (e.target === e.currentTarget) {
      onClose && onClose();
    }
  };

  return (
    <div
      className={`jules-modal-backdrop ${isOpen ? 'jules-modal-open' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "jules-modal-title-id" : undefined} // For accessibility
    >
      <div className="jules-modal-content" onClick={e => e.stopPropagation()}>
        {title && (
          <div className="jules-modal-header">
            <h3 id="jules-modal-title-id" className="jules-modal-title">{title}</h3>
            <button
              type="button"
              className="jules-modal-close-button"
              onClick={onClose}
              aria-label="Close modal" // Accessibility
            >
              &times; {/* Close icon */}
            </button>
          </div>
        )}
        <div className="jules-modal-body">
          {children}
        </div>
        {(footerContent || onClose) && ( // Render footer if custom content or a default close button is needed
          <div className="jules-modal-footer">
            {footerContent ? footerContent : (
              onClose && <button type="button" className="jules-button jules-button-secondary" onClick={onClose}>Close</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
