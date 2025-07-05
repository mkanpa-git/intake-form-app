import React from 'react';
import CheckboxGroup from '../CheckboxGroup/CheckboxGroup';

export default function CheckboxField({ field, value, onChange, error }) {
  return (
    <CheckboxGroup
      id={field.id}
      label={field.label}
      tooltip={field.tooltip}
      options={field.ui?.options || []}
      value={value || []}
      onChange={onChange}
      required={field.required}
      error={error}
      layout={field.ui?.layout}
    />
  );
}
