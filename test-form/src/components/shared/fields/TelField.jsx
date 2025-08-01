import React from 'react';
import MaskedInput from '../MaskedInput/MaskedInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faCircleXmark, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

export default function TelField({ field, value, onChange, error, touched }) {
  const iconLeft = <FontAwesomeIcon icon={faPhone} aria-hidden="true" />;
  const iconRight = error ? (
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
      mask="(000) 000-0000"
      placeholder={field.ui?.placeholder || '(123) 456-7890'}
      required={field.required}
      value={value || ''}
      onChange={onChange}
      error={error}
      iconLeft={iconLeft}
      iconRight={iconRight}
    />
  );
}
