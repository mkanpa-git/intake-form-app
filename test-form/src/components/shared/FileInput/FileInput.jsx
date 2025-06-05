import React from 'react';
import styles from './FileInput.module.css';

export default function FileInput({ id, label, multiple = false, error, onChange, ...props }) {
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!onChange) return;
    onChange(multiple ? Array.from(files) : files[0]);
  };

  return (
    <div className={styles.field}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type="file"
        multiple={multiple}
        onChange={handleFileChange}
        className={`${styles.input}${error ? ' error' : ''}`}
        {...props}
      />
      {error && <div className="form-error-alert">{error}</div>}
    </div>
  );
}
