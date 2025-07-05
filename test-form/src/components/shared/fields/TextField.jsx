import React from 'react';
import TextInput from '../TextInput/TextInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCircleXmark, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

export default function TextField({ field, value, onChange, error, touched }) {
  const iconLeft = field.type === 'email' ? (
    <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
  ) : undefined;
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
    <TextInput
      id={field.id}
      label={field.label}
      tooltip={field.tooltip}
      type={field.type}
      required={field.required}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      error={error}
      iconLeft={iconLeft}
      iconRight={iconRight}
    />
  );
}
