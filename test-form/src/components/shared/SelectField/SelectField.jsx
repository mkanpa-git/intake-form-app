import React from 'react';
import styles from './SelectField.module.css';

export default function SelectField({
  id,
  label,
  options = [],
  multiple = false,
  minSelections,
  maxSelections,
  ...props
}) {
  return (
    <div className={styles.field}>
      {label && <label htmlFor={id}>{label}</label>}
      <select
        id={id}
        className={styles.select}
        multiple={multiple}
        data-min={minSelections}
        data-max={maxSelections}
        {...props}
      >
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const labelText = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={value} value={value}>
              {labelText}
            </option>
          );
        })}
      </select>
    </div>
  );
}
