import React from 'react';
import styles from './RadioGroup.module.css';
import Tooltip from '../Tooltip/Tooltip';

export default function RadioGroup({
  id,
  label,
  tooltip,
  options = [],
  value,
  onChange,
  ...props
}) {
  return (
    <fieldset className={styles.group}>
      {label && (
        <legend>
          {label}
          <Tooltip text={tooltip} />
        </legend>
      )}
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
