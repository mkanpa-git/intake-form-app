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
          const inputId = `${id}-${optValue}`; // Unique ID for accessibility

          return (
            <label key={optValue} className="jules-checkbox-option" htmlFor={inputId}>
              <input
                type="checkbox"
                id={inputId}
                name={`${id}-${optValue}`}
                value={optValue}
                checked={checked}
                onChange={e => handleChange(optValue, e.target.checked)}
                className="jules-checkbox-input"
                {...props}
              />
              <span className="jules-checkbox-custom" aria-hidden="true"></span>
              <span className="jules-checkbox-label-text">{optLabel}</span>
            </label>
          );
        })}
      </div>
      {hint && !error && <p className="jules-input-hint">{hint}</p>}
      {error && (
        <div
          id={`${id}-error`}
          className="jules-alert jules-alert-error jules-input-error-message"
          tabIndex="-1"
        >
          {error}
        </div>
      )}
    </fieldset>
  );
}
