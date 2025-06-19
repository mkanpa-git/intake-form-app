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
            // The prompt asked for label.jules-radio-option.
            // My jules_input.css uses div.jules-radio-option > input + span.jules-radio-custom + label.jules-radio-label-text
            // Let's adapt to the div wrapper structure.
            <div key={optValue} className="jules-radio-option">
              <input
                type="radio"
                id={inputId} // Use unique id
                name={id} // Group by name (original id prop)
                value={optValue}
                checked={value === optValue}
                onChange={onChange}
                className="jules-radio-input" // Class for the input itself
                required={required && !value} // HTML5 required only works if no option is checked
                {...props}
              />
              <span className="jules-radio-custom"></span>
              <label htmlFor={inputId} className="jules-radio-label-text">
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
