import React from 'react';
// import styles from './CheckboxGroup.module.css'; // Removed CSS Module import - likely redundant
import Tooltip from '../Tooltip/Tooltip'; // Assuming Tooltip is already refactored

export default function CheckboxGroup({
  id, // Used as base for name attribute of checkbox inputs
  label,
  tooltip,
  options = [],
  value = [],
  onChange,
  required, // Added required prop
  error,    // Added error prop
  hint,     // Added hint prop
  layout = 'vertical', // 'vertical' or 'horizontal'
  className,
  ...props
}) {
  const handleChange = (optionValue, checked) => {
    if (!onChange) return;
    const updated = checked
      ? [...(Array.isArray(value) ? value : []), optionValue]
      : (Array.isArray(value) ? value : []).filter(v => v !== optionValue);
    onChange(updated);
  };

  const fieldsetClasses = [
    'jules-fieldset', // Base class for fieldset styling from jules_input.css
    className || ''
  ].join(' ').trim();

  const groupClasses = [
    'jules-checkbox-group',
    layout === 'horizontal' ? 'jules-checkbox-group-horizontal' : ''
  ].join(' ').trim();

  return (
    <fieldset className={fieldsetClasses}>
      {label && (
        <legend className="jules-legend">
          {label}
          {required && <span className="jules-required-asterisk">*</span>}
          {tooltip && <Tooltip text={tooltip} />}
        </legend>
      )}
      <div className={groupClasses}>
        {options.map(opt => {
          const optValue = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          const checked = Array.isArray(value) && value.includes(optValue);
          const inputId = `${id}-${optValue}`; // Create unique ID for each checkbox input

          return (
            <div key={optValue} className="jules-checkbox-option">
              <input
                type="checkbox"
                id={inputId} // Use unique id
                name={`${id}-${optValue}`} // Unique name for each checkbox for better form handling, or share 'id' if backend expects array under one name
                value={optValue}
                checked={checked}
                onChange={e => handleChange(optValue, e.target.checked)}
                className="jules-checkbox-input" // Class for the input itself
                // HTML5 'required' on a group of checkboxes is tricky.
                // Usually handled by JS. If one must be checked, one input can have 'required'.
                // For simplicity, not adding 'required' on individual checkboxes here unless specifically needed.
                {...props}
              />
              <span className="jules-checkbox-custom"></span>
              <label htmlFor={inputId} className="jules-checkbox-label-text">
                {optLabel}
              </label>
            </div>
          );
        })}
      </div>
      {hint && !error && <p className="jules-input-hint">{hint}</p>}
      {error && <div className="jules-alert jules-alert-error jules-input-error-message">{error}</div>}
    </fieldset>
  );
}
