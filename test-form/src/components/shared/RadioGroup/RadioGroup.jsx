import React from 'react';
// import styles from './RadioGroup.module.css'; // Removed CSS Module import - likely redundant
import Tooltip from '../Tooltip/Tooltip'; // Assuming Tooltip is already refactored

export default function RadioGroup({
  id, // Used as name for radio inputs
  label,
  tooltip,
  options = [],
  value,
  onChange,
  required, // Added required prop
  error,    // Added error prop
  hint,     // Added hint prop
  layout = 'vertical', // 'vertical' or 'horizontal'
  className,
  ...props
}) {
  const fieldsetClasses = [
    'jules-fieldset', // Base class for fieldset styling from jules_input.css
    className || ''
  ].join(' ').trim();

  const groupClasses = [
    'jules-radio-group',
    layout === 'horizontal' ? 'jules-radio-group-horizontal' : ''
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
          const inputId = `${id}-${optValue}`; // Create unique ID for each radio input for the label's htmlFor
          return (
            <label key={optValue} className="jules-radio-option">
              <input
                type="radio"
                id={inputId}
                name={id}
                value={optValue}
                checked={value === optValue}
                onChange={onChange}
                className="jules-radio-input"
                required={required && !value}
                {...props}
              />
              <span className="jules-radio-custom"></span>
              <span className="jules-radio-label-text">{optLabel}</span>
            </label>
          );
        })}
      </div>
      {hint && !error && <p className="jules-input-hint">{hint}</p>}
      {error && <div className="jules-alert jules-alert-error jules-input-error-message">{error}</div>}
    </fieldset>
  );
}
