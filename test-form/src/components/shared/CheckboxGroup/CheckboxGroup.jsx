import React from 'react';
import styles from './CheckboxGroup.module.css';

export default function CheckboxGroup({ id, label, options = [], value = [], onChange, ...props }) {
  const handleChange = (optionValue, checked) => {
    if (!onChange) return;
    const updated = checked
      ? [...(Array.isArray(value) ? value : []), optionValue]
      : (Array.isArray(value) ? value : []).filter(v => v !== optionValue);
    onChange(updated);
  };

  return (
    <fieldset className={styles.group}>
      {label && <legend>{label}</legend>}
      {options.map(opt => {
        const optValue = typeof opt === 'string' ? opt : opt.value;
        const optLabel = typeof opt === 'string' ? opt : opt.label;
        const checked = Array.isArray(value) && value.includes(optValue);
        return (
          <label key={optValue} className={styles.option}>
            <input
              type="checkbox"
              name={id}
              value={optValue}
              checked={checked}
              onChange={e => handleChange(optValue, e.target.checked)}
              {...props}
            />
            {optLabel}
          </label>
        );
      })}
    </fieldset>
  );
}
