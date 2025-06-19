import React from 'react';
// import styles from './Section.module.css'; // Removed CSS Module import

export default function Section({
  title,
  children,
  isCollapsed = false,
  onToggle,
  showAlert = false, // This prop might need to be handled by rendering a jules-alert component
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
        {/* showAlert prop should ideally render a proper jules-alert component if the message is complex */}
        {/* For a simple icon, this could be a span, but its styling was not defined in jules_section.css directly */}
        {showAlert && <span className="jules-section-alert-icon">⚠️</span>} {/* Changed text to icon, added class */}
        {onToggle && <span className="jules-section-toggle-icon">{isCollapsed ? '▶' : '▼'}</span>}
      </div>
      <div className={contentClasses}>
        {children}
      </div>
    </section>
  );
}
