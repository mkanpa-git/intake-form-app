import React from 'react';
import styles from './TextInput.module.css';

export default function TextInput({ id, label, ...props }) {
  return (
    <div className={styles.field}>
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} className={styles.input} {...props} />
    </div>
  );
}
