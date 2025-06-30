import React, { useState, useEffect } from 'react'; // Added useState, useEffect
// import styles from './SelectField.module.css'; // Removed CSS Module import - likely redundant
import Tooltip from '../Tooltip/Tooltip'; // Assuming Tooltip is already refactored

export default function SelectField({
  id,
  label,
  tooltip,
  options = [],
  multiple = false,
  placeholder,
  minSelections,
  maxSelections,
  required,
  error,
  hint,
  iconLeft,
  iconRight,
  className,
  selectClassName,
  value, // Added value to props destructuring
  defaultValue, // Added defaultValue
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  // For select, "has value" means a non-empty option is selected.
  // If there's a placeholder option (value=""), that doesn't count as having a value.
  const [hasValue, setHasValue] = useState(Boolean(multiple ? (value || defaultValue)?.length > 0 : (value || defaultValue)));

  useEffect(() => {
    setHasValue(Boolean(multiple ? value?.length > 0 : value));
  }, [value, multiple]);

  const handleFocus = (e) => {
    setIsFocused(true);
    props.onFocus && props.onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    // For uncontrolled select with placeholder, check if current value is not the placeholder value
    if (defaultValue !== undefined && !multiple && placeholder) {
        setHasValue(Boolean(e.target.value));
    }
    props.onBlur && props.onBlur(e);
  };

  const handleChange = (e) => {
    if (multiple) {
        const selectedValues = Array.from(e.target.selectedOptions).map(opt => opt.value);
        setHasValue(selectedValues.length > 0);
    } else {
        setHasValue(Boolean(e.target.value)); // True if value is not ""
    }
    props.onChange && props.onChange(e);
  };

  const formFieldClasses = [
    'jules-form-field',
    isFocused ? 'is-focused' : '',
    hasValue ? 'has-value' : '',
    className || ''
  ].join(' ').trim();

  const currentSelectClassName = [
    'jules-input',
    error ? 'jules-input-error' : '',
    iconLeft ? 'jules-input-has-icon-left' : '',
    iconRight ? 'jules-input-has-icon-right' : '',
    selectClassName || ''
  ].join(' ').trim();

  const inputWrapperClasses = ['jules-input-wrapper', multiple ? 'jules-multiselect-wrapper' : 'jules-select-wrapper'].join(' ').trim();

  return (
    <div className={formFieldClasses}>
      <div className={inputWrapperClasses}>
        {iconLeft && <span className="jules-input-icon jules-input-icon-left">{iconLeft}</span>}
        <select
          id={id}
          className={currentSelectClassName}
          multiple={multiple}
          data-min={minSelections}
          data-max={maxSelections}
          required={required}
          value={value} // Controlled component value
          defaultValue={defaultValue} // For uncontrolled components
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        >
          {placeholder && !multiple && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => {
            const optVal = typeof opt === 'string' ? opt : opt.value;
            const optLabel = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={optVal} value={optVal}>
                {optLabel}
              </option>
            );
          })}
        </select>
        {/* Right icon for select might be tricky due to native dropdown arrow.
            CSS for .jules-select.jules-input-has-icon-right needs to handle this.
            If a custom arrow is used (by hiding native one), this becomes easier.
        */}
        {iconRight && !multiple && <span className="jules-input-icon jules-input-icon-right">{iconRight}</span>}
      </div>
      {label && (
        <label htmlFor={id} className="jules-label">
          {label}
          {required && <span className="jules-required-asterisk">*</span>}
        </label>
      )}
      {tooltip && <Tooltip text={tooltip} />}
      {hint && !error && <p className="jules-input-hint">{hint}</p>}
      {error && <div className="jules-alert jules-alert-error jules-input-error-message">{error}</div>}
    </div>
  );
}
