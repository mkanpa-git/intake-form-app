import React from 'react';
import { IMaskInput } from 'react-imask';
import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import { IMaskInput } from 'react-imask';
// import styles from './MaskedInput.module.css'; // Removed CSS Module import - likely redundant
import Tooltip from '../Tooltip/Tooltip'; // Assuming Tooltip is already refactored

export default function MaskedInput({
  id,
  label,
  tooltip,
  mask,
  error,
  onChange,
  value,
  placeholder,
  required, // Added required prop
  hint,     // Added hint prop
  iconLeft, // Added iconLeft
  iconRight, // Added iconRight
  className, // For the wrapper div .jules-form-field
  inputClassName, // For the input element itself
  defaultValue, // Added defaultValue for uncontrolled components
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value || defaultValue || (props.placeholder && props.placeholder !== " ")));

  useEffect(() => {
    // Handles controlled component value changes and initial placeholder check
    setHasValue(Boolean(value || (props.placeholder && props.placeholder !== " ")));
  }, [value, props.placeholder]);

  const handleFocus = (e) => {
    setIsFocused(true);
    props.onFocus && props.onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    // For IMaskInput, `e.target.value` might not be what we expect due to masking.
    // The `onAccept` handler provides the unmasked (or masked, depending on `unmask` prop) value.
    // However, `onAccept` fires during typing. For `hasValue` on blur for uncontrolled,
    // we might need to rely on the value passed to `onAccept` or check the input's current raw value.
    // For simplicity, if it's uncontrolled, we'll assume `onAccept` has updated some parent state
    // that would feed back into `value` or `defaultValue` if fully uncontrolled.
    // Or, if `value` is directly from state managed by `onAccept`, this is fine.
    // If truly uncontrolled with defaultValue, this check might be tricky.
    // Let's assume `value` prop or component's internal value (via `onAccept`) reflects current state.
    // The `value` prop itself will be the primary driver for `hasValue` in controlled scenarios.
  };

  // `onAccept` is the primary way to get value from IMaskInput
  const handleAccept = (val, maskRef) => {
    setHasValue(Boolean(val || (props.placeholder && props.placeholder !== " ")));
    onChange && onChange(val); // Pass the value to the parent's onChange
    // `props.onChange` (from IMaskInput) is not what we want here, we use `onAccept`
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
      <div className="jules-input-wrapper">
        {iconLeft && <span className="jules-input-icon jules-input-icon-left">{iconLeft}</span>}
        <IMaskInput
          id={id}
          mask={mask}
          value={value || ''}
          unmask={false} // Keep this as per original, usually for display
          onAccept={handleAccept} // Use onAccept for value changes
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={props.placeholder || " "} // Use a space for :placeholder-shown if CSS relies on it
          className={currentInputClassName}
          required={required}
          {...props}
        />
        {iconRight && <span className="jules-input-icon jules-input-icon-right">{iconRight}</span>}
      </div>
      {label && (
        <label htmlFor={id} className="jules-label">
          {label}
          {required && <span className="jules-required-asterisk">*</span>}
        </label>
      )}
      {tooltip && <div style={{marginLeft: 'var(--jules-space-sm)', marginTop: 'var(--jules-space-xxs)'}}><Tooltip text={tooltip}/></div>}
      {hint && !error && <p className="jules-input-hint">{hint}</p>}
      {error && <div className="jules-alert jules-alert-error jules-input-error-message">{error}</div>}
    </div>
  );
}
