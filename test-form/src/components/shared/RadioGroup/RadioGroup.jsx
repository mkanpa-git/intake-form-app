import React from 'react';
import styles from './RadioGroup.module.css';

export default function RadioGroup({
  id,
  label,
  options = [],
  value,
  onChange,
  ...props
}) {
  return (
    <fieldset className={styles.group}>
      {label && <legend>{label}</legend>}
      {options.map(opt => {
        const optValue = typeof opt === 'string' ? opt : opt.value;
        const optLabel = typeof opt === 'string' ? opt : opt.label;
        return (
          <label key={optValue} className={styles.option}>
            <input
              type="radio"
              name={id}
              value={optValue}
              checked={value === optValue}
              onChange={onChange}
              {...props}
            />
            {optLabel}
          </label>
        );
      })}
    </fieldset>
  );
}
