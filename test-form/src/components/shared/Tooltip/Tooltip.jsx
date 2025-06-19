import React, { useState } from 'react';
// import styles from './Tooltip.module.css'; // Removed CSS Module import - likely redundant

export default function Tooltip({ text, className }) { // Added className prop for flexibility
  const [show, setShow] = useState(false);
  if (!text) return null;

  const wrapperClasses = [
    'jules-tooltip-wrapper',
    className || ''
  ].join(' ').trim();

  const tooltipTextClasses = [
    'jules-tooltip-text',
    show ? 'jules-tooltip-visible' : ''
  ].join(' ').trim();

  return (
    // The wrapper is inline by default, can be changed by parent CSS if needed.
    // Added a small delay for mouse leave to prevent flickering if user quickly re-enters.
    <span
      className={wrapperClasses}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setTimeout(() => setShow(false), 100)} // Small delay
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex={0} // Make the wrapper focusable to trigger tooltip for keyboard users
    >
      <span className="jules-tooltip-icon" aria-hidden="true">
        {/* Using a common info icon, can be replaced by SVG or other icon font */}
        {/* For this refactor, keeping ℹ️ but it might need explicit styling if not an actual image/SVG */}
        ℹ️
      </span>
      <span
        className={tooltipTextClasses}
        role="tooltip"
      >
        {text}
      </span>
    </span>
  );
}
