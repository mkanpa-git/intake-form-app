import React from 'react';
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
  className,
  ...props
}) {
  const inputClasses = [
    'jules-input',
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
      <IMaskInput
        id={id}
        mask={mask}
        value={value || ''} // Ensure value is not null/undefined for IMaskInput
        unmask={false} // Or true, depending on what value `onChange` expects
        onAccept={(val) => onChange && onChange(val)}
        placeholder={placeholder}
        className={inputClasses}
        required={required}
        {...props}
      />
      {hint && !error && <p className="jules-input-hint">{hint}</p>}
      {error && <div className="jules-alert jules-alert-error jules-input-error-message">{error}</div>}
    </div>
  );
}
