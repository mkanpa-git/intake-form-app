import React from 'react';
import RadioGroup from '../RadioGroup/RadioGroup';

export default function RadioField({ field, value, onChange, error }) {
  return (
    <RadioGroup
      id={field.id}
      label={field.label}
      tooltip={field.tooltip}
      options={field.ui?.options || []}
      value={value || ''}
      onChange={onChange}
      required={field.required}
      error={error}
      layout={field.ui?.layout}
    />
  );
}
