import React, { useState } from 'react';
import MaskedInput from '../MaskedInput/MaskedInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleXmark,
  faCircleCheck,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';

export default function SsnField({ field, value, onChange, error, touched }) {
  const [revealed, setRevealed] = useState(false);

  const toggleIcon = (
    <button
      type="button"
      onClick={() => setRevealed((r) => !r)}
      className="jules-input-icon-button"
      aria-label={revealed ? 'Hide SSN' : 'Show SSN'}
    >
      <FontAwesomeIcon icon={revealed ? faEyeSlash : faEye} aria-hidden="true" />
    </button>
  );

  const validationIcon = error ? (
    <span className="jules-validation-icon-error">
      <FontAwesomeIcon icon={faCircleXmark} aria-hidden="true" />
      <span className="sr-only">Error</span>
    </span>
  ) : (!error && touched && value ? (
    <span className="jules-validation-icon-success">
      <FontAwesomeIcon icon={faCircleCheck} aria-hidden="true" />
      <span className="sr-only">Valid</span>
    </span>
  ) : undefined);

  return (
    <MaskedInput
      id={field.id}
      label={field.label}
      mask="000-00-0000"
      placeholder="123-45-6789"
      required={field.required}
      value={value || ''}
      onChange={onChange}
      error={error}
      type={revealed ? 'text' : 'password'}
      iconLeft={toggleIcon}
      iconRight={validationIcon}
    />
  );
}
