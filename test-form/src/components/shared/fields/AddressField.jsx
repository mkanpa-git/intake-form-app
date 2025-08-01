import React from 'react';
import AddressAutocomplete from '../AddressAutocomplete';

export default function AddressField({ field, value, onChange, error, onAddressSelect, placeholder }) {
  return (
    <>
      <AddressAutocomplete
        id={field.id}
        label={field.label}
        required={field.required}
        value={value || ''}
        placeholder={placeholder || field.ui?.placeholder || ''}
        onChange={onChange}
        onAddressSelect={onAddressSelect}
        error={error}
      />
      {error && (
        <div
          id={`${field.id}-error`}
          className="jules-alert jules-alert-error jules-input-error-message"
          tabIndex="-1"
        >
          {error}
        </div>
      )}
    </>
  );
}
