import React from 'react';
import SelectField from '../SelectField/SelectField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

export default function SelectFieldWrapper({ field, value, onChange, error, touched }) {
  const iconRight = error ? (
    <span className="jules-validation-icon-error">
      <FontAwesomeIcon icon={faCircleXmark} aria-hidden="true" />
      <span className="sr-only">Error</span>
    </span>
  ) : (!error && touched && (Array.isArray(value) ? value.length : value) ? (
    <span className="jules-validation-icon-success">
      <FontAwesomeIcon icon={faCircleCheck} aria-hidden="true" />
      <span className="sr-only">Valid</span>
    </span>
  ) : undefined);

  return (
    <SelectField
      id={field.id}
      label={field.label}
      tooltip={field.tooltip}
      options={field.ui?.options || []}
      multiple={field.metadata?.multiple}
      required={field.required}
      minSelections={field.constraints?.minSelections}
      maxSelections={field.constraints?.maxSelections}
      placeholder={field.ui?.placeholder}
      value={value || (field.metadata?.multiple ? [] : '')}
      onChange={onChange}
      error={error}
      iconRight={iconRight}
    />
  );
}
