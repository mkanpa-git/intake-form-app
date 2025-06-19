import React from 'react';
// import styles from './SelectField.module.css'; // Removed CSS Module import - likely redundant
import Tooltip from '../Tooltip/Tooltip'; // Assuming Tooltip is already refactored

export default function SelectField({
  id,
  label,
  tooltip,
  options = [],
  multiple = false,
  placeholder,
  minSelections, // Note: jules_input.css doesn't directly handle min/maxSelections visually by default
  maxSelections, // These would typically be enforced by JS validation logic
  required,
  error,
  hint,
  className,
  ...props
}) {
  const selectClasses = [
    'jules-input', // .jules-input is the base style for select as well
    error ? 'jules-input-error' : '',
    className || ''
  ].join(' ').trim();

  return (
    <div className="jules-form-field"> {/* Changed from jules-input-group to jules-form-field */}
      {label && (
        <label htmlFor={id} className="jules-label">
          {label}
          {required && <span className="jules-required-asterisk">*</span>}
          {tooltip && <Tooltip text={tooltip} />}
        </label>
      )}
      <select
        id={id}
        className={selectClasses}
        multiple={multiple}
        data-min={minSelections} // Keep data attributes for potential JS use
        data-max={maxSelections}
        required={required}
        {...props}
      >
        {placeholder && !multiple && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const labelText = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={value} value={value}>
              {labelText}
            </option>
          );
        })}
      </select>
      {hint && !error && <p className="jules-input-hint">{hint}</p>}
      {error && <div className="jules-alert jules-alert-error jules-input-error-message">{error}</div>}
    </div>
  );
}
