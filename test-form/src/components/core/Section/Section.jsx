import React from 'react';
import styles from './Section.module.css';

export default function Section({
  title,
  children,
  isCollapsed = false,
  onToggle,
  showAlert = false,
  required = false,
}) {
  return (
    <section className={styles.section}>
      <div
        className={`form-section-header ${isCollapsed ? 'collapsed' : ''}`}
        onClick={onToggle}
      >
        <span>
          {title}
          {required && <span className="required-asterisk"> *</span>}
        </span>
        {showAlert && <span className="form-section-alert">⚠ Input required</span>}
        <span className="toggle-icon">{isCollapsed ? '    ▶' : '    ▼'}</span>
      </div>
      {!isCollapsed && children}
    </section>
  );
}
