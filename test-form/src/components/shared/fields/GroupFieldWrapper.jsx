import React from 'react';
import GroupField from '../GroupField/GroupField';

export default function GroupFieldWrapper({ field, value, onChange, fullData }) {
  return (
    <GroupField
      field={field}
      value={value || []}
      onChange={onChange}
      fullData={fullData}
    />
  );
}
