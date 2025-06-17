import React from 'react';
import styles from './Modal.module.css';

export default function Modal({ children, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {children}
        <div className={styles.actions}>
          <button type="button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
