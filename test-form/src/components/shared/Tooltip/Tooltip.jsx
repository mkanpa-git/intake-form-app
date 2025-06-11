import React, { useState } from 'react';
import styles from './Tooltip.module.css';

export default function Tooltip({ text }) {
  const [show, setShow] = useState(false);
  if (!text) return null;

  return (
    <span
      className={styles.wrapper}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex="0"
    >
      <span className={styles.icon} aria-hidden="true">
        ℹ️
      </span>
      <span
        className={`${styles.tooltip} ${show ? styles.visible : ''}`}
        role="tooltip"
      >
        {text}
      </span>
    </span>
  );
}
