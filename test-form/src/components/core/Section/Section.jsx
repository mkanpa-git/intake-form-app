import React from 'react';
import styles from './Section.module.css';

export default function Section({ title, children }) {
  return (
    <section className={styles.section}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}
