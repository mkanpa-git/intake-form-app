import React from 'react';
import styles from './RadioGroup.module.css';

export default function RadioGroup({ id, label, options = [], ...props }) {
  return (
    <fieldset className={styles.group}>
      {label && <legend>{label}</legend>}
      {options.map(opt => (
        <label key={opt} className={styles.option}>
          <input type="radio" name={id} value={opt} {...props} />
          {opt}
        </label>
      ))}
    </fieldset>
  );
}
