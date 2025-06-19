import React from 'react';
// import styles from './Section.module.css'; // Removed CSS Module import

export default function Section({
  title,
  children,
  isCollapsed = false,
  onToggle,
  showAlertIcon = false, // Renamed from showAlert for clarity, indicates missing required fields
  showErrorIcon = false, // New prop for validation errors
  required = false,
  visible = true,
}) {
  if (!visible) return null;

  const headerClasses = `jules-section-header ${isCollapsed ? 'jules-section-collapsed' : ''} ${onToggle ? 'jules-section-collapsible' : ''}`;
  const contentClasses = `jules-section-content ${isCollapsed ? 'jules-section-content-collapsed' : ''}`;

  return (
    <section className="jules-section">
      <div
        className={headerClasses}
        onClick={onToggle} // onClick should ideally only be there if onToggle is provided
        role={onToggle ? "button" : undefined}
        aria-expanded={onToggle ? !isCollapsed : undefined}
        tabIndex={onToggle ? 0 : undefined}
        onKeyDown={onToggle ? (e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(); } : undefined}
      >
        <span className="jules-section-title"> {/* Added a class for the title itself for more specific styling if needed */}
          {title}
          {required && <span className="jules-required-asterisk"> *</span>}
        </span>
        <div> {/* Wrapper for icons to ensure they are grouped and to the right of title */}
          {isCollapsed && showAlertIcon && !showErrorIcon && ( // Show general alert only if no validation error icon
            <span className="jules-section-alert-icon" aria-label="Section has missing required inputs">
              ⚠️
            </span>
          )}
          {isCollapsed && showErrorIcon && (
            <span className="jules-section-header-error-indicator" aria-label="Section contains errors">
              ❗ {/* Using a different icon for validation errors */}
            </span>
          )}
          {onToggle && <span className="jules-section-toggle-icon">{isCollapsed ? '▶' : '▼'}</span>}
        </div>
      </div>
      <div className={contentClasses}>
        {children}
      </div>
    </section>
  );
}
