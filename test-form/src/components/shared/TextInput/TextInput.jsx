import React, { useState, useEffect } from 'react';
// import styles from './TextInput.module.css'; // Removed CSS Module import - likely redundant

import Tooltip from '../Tooltip/Tooltip'; // Assuming Tooltip is already refactored or handles its own styling

export default function TextInput({
  id,
  label,
  tooltip,
  required,
  error,
  hint,
  iconLeft,
  iconRight,
  type = 'text',
  className,
  inputClassName,
  value, // Ensure value is part of props to check for hasValue state
  defaultValue, // Also check defaultValue
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  // Determine if the input has a value. Handles both controlled and uncontrolled components.
  const [hasValue, setHasValue] = useState(Boolean(value || defaultValue || props.placeholder === ' '));


  // Update hasValue state if the value prop changes (for controlled components)
  useEffect(() => {
    setHasValue(Boolean(value || props.placeholder === ' '));
  }, [value, props.placeholder]);


  const handleFocus = (e) => {
    setIsFocused(true);
    props.onFocus && props.onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    // For uncontrolled components, check value on blur. For controlled, value prop handles it.
    if (props.defaultValue !== undefined) { // Heuristic for uncontrolled
        setHasValue(Boolean(e.target.value || props.placeholder === ' '));
    }
    props.onBlur && props.onBlur(e);
  };

  const handleChange = (e) => {
    setHasValue(Boolean(e.target.value || props.placeholder === ' '));
    props.onChange && props.onChange(e);
  };


  const formFieldClasses = [
    'jules-form-field',
    isFocused ? 'is-focused' : '',
    hasValue ? 'has-value' : '',
    className || ''
  ].join(' ').trim();

  const currentInputClassName = [
    'jules-input',
    error ? 'jules-input-error' : '',
    iconLeft ? 'jules-input-has-icon-left' : '',
    iconRight ? 'jules-input-has-icon-right' : '',
    inputClassName || ''
  ].join(' ').trim();

  return (
    <div className={formFieldClasses}>
      {/* Input is now before the label for potential CSS selector usage, though JS classes are primary */}
      <div className="jules-input-wrapper">
        {iconLeft && <span className="jules-input-icon jules-input-icon-left">{iconLeft}</span>}
        <input
          id={id}
          type={type}
          className={currentInputClassName}
          required={required}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange} // Added to update hasValue on change for uncontrolled inputs
          value={value} // Controlled component value
          defaultValue={defaultValue} // For uncontrolled components
          placeholder={props.placeholder || " "} // Use a space for :placeholder-shown if CSS relies on it, otherwise controlled by has-value class
          {...props}
        />
        {iconRight && <span className="jules-input-icon jules-input-icon-right">{iconRight}</span>}
      </div>
       {label && (
        // Tooltip removed from inside label for simplicity with absolute positioning
        <label htmlFor={id} className="jules-label">
          {label}
          {required && <span className="jules-required-asterisk">*</span>}
        </label>
      )}
      {/* Render tooltip outside the label, but still associated with the field */}
      {tooltip && <div style={{marginLeft: 'var(--jules-space-sm)', marginTop: 'var(--jules-space-xxs)'}}><Tooltip text={tooltip}/></div>}

      {hint && !error && <p className="jules-input-hint">{hint}</p>}
      {error && <div className="jules-alert jules-alert-error jules-input-error-message">{error}</div>}
    </div>
  );
}
