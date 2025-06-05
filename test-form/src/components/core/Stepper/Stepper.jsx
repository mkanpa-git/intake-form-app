import React from 'react';
import styles from './Stepper.module.css';

export default function Stepper({ steps = [], currentStep = 0, onStepChange }) {
  return (
    <aside className={styles.sidebar}>
      <h4>Steps</h4>
      <ul className={styles.list}>
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={`${styles.item} ${index === currentStep ? styles.active : ''}`}
            onClick={() => onStepChange && onStepChange(index)}
          >
            {step.title}
          </li>
        ))}
      </ul>
    </aside>
  );
}
