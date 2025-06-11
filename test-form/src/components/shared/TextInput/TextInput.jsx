import React from 'react';
import styles from './TextInput.module.css';

import Tooltip from '../Tooltip/Tooltip';

export default function TextInput({ id, label, tooltip, ...props }) {
  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={id}>
          {label}
          <Tooltip text={tooltip} />
        </label>
      )}
      <input id={id} className={styles.input} {...props} />
    </div>
  );
}
