import React from 'react';
import { IMaskInput } from 'react-imask';
import styles from './MaskedInput.module.css';
import Tooltip from '../Tooltip/Tooltip';

export default function MaskedInput({ id, label, tooltip, mask, error, onChange, value, placeholder, ...props }) {
  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={id}>
          {label}
          <Tooltip text={tooltip} />
        </label>
      )}
      <IMaskInput
        id={id}
        mask={mask}
        value={value}
        unmask={false}
        onAccept={(val) => onChange && onChange(val)}
        placeholder={placeholder}
        className={`${styles.input}${error ? ' error' : ''}`}
        {...props}
      />
      {error && <div className="form-error-alert">{error}</div>}
    </div>
  );
}
