import React from 'react';
import styles from './SelectField.module.css';

export default function SelectField({ id, label, options = [], ...props }) {
  return (
    <div className={styles.field}>
      {label && <label htmlFor={id}>{label}</label>}
      <select id={id} className={styles.select} {...props}>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
