import React from 'react';
// import styles from './TextInput.module.css'; // Removed CSS Module import - likely redundant

import Tooltip from '../Tooltip/Tooltip'; // Assuming Tooltip is already refactored or handles its own styling

export default function TextInput({ id, label, tooltip, required, error, hint, className, ...props }) {
  const inputClasses = [
    'jules-input',
    error ? 'jules-input-error' : '',
    className || '' // Allow passing additional classes
  ].join(' ').trim();

  return (
    <div className="jules-form-field"> {/* Changed from jules-input-group to jules-form-field for consistency with other inputs */}
      {label && (
        <label htmlFor={id} className="jules-label">
          {label}
          {required && <span className="jules-required-asterisk">*</span>}
          {/* Tooltip component should be styled to fit alongside label text if needed */}
          {tooltip && <Tooltip text={tooltip} />}
        </label>
      )}
      <input id={id} className={inputClasses} required={required} {...props} />
      {hint && !error && <p className="jules-input-hint">{hint}</p>}
      {error && <div className="jules-alert jules-alert-error jules-input-error-message">{error}</div>} {/* Changed to jules-input-error-message */}
    </div>
  );
}
