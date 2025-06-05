import React from 'react';
import styles from './Stepper.module.css';

export default function Stepper({
  steps = [],
  currentStep = 0,
  onStepChange,
  requiredDocs = [],
}) {
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
      {requiredDocs.length > 0 && (
        <div className={styles.requiredDocs}>
          <h5>Required Documents</h5>
          <ul>
            {requiredDocs.map((doc) => (
              <li key={doc}>{doc}</li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
