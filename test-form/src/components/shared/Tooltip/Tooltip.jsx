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
    >
      <span className={styles.icon}>ℹ️</span>
      {show && <span className={styles.tooltip}>{text}</span>}
    </span>
  );
}
