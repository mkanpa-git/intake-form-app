import React from 'react';
import FileInput from '../FileInput/FileInput';

export default function FileField({ field, value, onChange, error, applicationId }) {
  return (
    <FileInput
      id={field.id}
      label={field.label}
      tooltip={field.tooltip}
      description={field.description}
      multiple={field.metadata?.multiple}
      required={field.required}
      onChange={onChange}
      applicationId={applicationId}
      hint={Array.isArray(field.metadata?.examples)
        ? `Examples: ${field.metadata.examples.join(', ')}`
        : field.metadata?.examples}
      error={error}
    />
  );
}
