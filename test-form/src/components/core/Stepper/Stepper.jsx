import React from 'react';
import styles from './Stepper.module.css';

export default function Stepper({
  steps = [],
  currentStep = 0,
  onStepChange,
  requiredDocs = [],
  orientation = 'vertical',
  canNavigate,
}) {
  const isHorizontal = orientation === 'horizontal';
  const containerClass = isHorizontal ? styles.horizontalContainer : styles.sidebar;
  const listClass = isHorizontal ? styles.horizontalList : styles.list;
  const itemClass = isHorizontal ? styles.horizontalItem : styles.item;

  const handleClick = (idx) => {
    if (idx === currentStep) return;
    if (canNavigate && !canNavigate(idx)) return;
    onStepChange && onStepChange(idx);
  };

  return (
    <aside className={containerClass}>
      <h4>Steps</h4>
      <div className={styles.progress}>
        Step {currentStep + 1} of {steps.length}
      </div>
      <ul className={listClass}>
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep;
          return (
            <li
              key={step.id}
              className={`${itemClass} ${isActive ? styles.active : ''} ${
                isComplete ? styles.complete : ''
              }`}
              onClick={() => handleClick(index)}
            >
              <span className={styles.icon}>
                {isComplete ? '✓' : isActive ? '▶' : ''}
              </span>
              {step.title}
            </li>
          );
        })}
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
