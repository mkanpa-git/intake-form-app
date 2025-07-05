import React from 'react';
// import styles from './Stepper.module.css'; // Removed CSS Module import

export default function Stepper({
  steps = [],
  currentStep = 0,
  onStepChange,
  requiredDocs = [],
  orientation = 'vertical',
  canNavigate,
}) {
  const isHorizontal = orientation === 'horizontal';

  const containerClass = `jules-stepper ${isHorizontal ? 'jules-stepper-horizontal' : 'jules-stepper-vertical'}`;
  // The list itself might not need a specific class if .jules-stepper directly styles its child ol or if the items are direct children.
  // Assuming .jules-stepper is the ul, or it directly styles the ul.
  // For now, let's assume the containerClass is applied to the <aside> and the <ol> is part of its structure.
  // jules_stepper.css was designed with .jules-stepper as the main list container.
  // So, the <aside> might be a wrapper, and the <ol> inside gets the .jules-stepper classes.

  const handleClick = (idx) => {
    if (idx === currentStep) return;
    if (canNavigate && !canNavigate(idx)) return;
    onStepChange && onStepChange(idx);
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min(idx + 1, steps.length - 1);
      if (next !== idx) handleClick(next);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = Math.max(idx - 1, 0);
      if (prev !== idx) handleClick(prev);
    }
  };

  return (
    // The <aside> can be a generic container; the <ol> inside will be the actual stepper component
    <aside
      className={
        isHorizontal
          ? 'jules-stepper-container-horizontal'
          : 'jules-stepper-container-vertical'
      }
    >
      <h4>Steps</h4>{' '}
      {/* This h4 might need jules styling or be removed if stepper design incorporates title */}
      <div
        className="jules-stepper-progress"
        aria-label={`Step ${currentStep + 1} of ${steps.length}`}
      >
        Step {currentStep + 1} of {steps.length}
      </div>
      <nav aria-label="Stepper Navigation">
        <ol className={containerClass} aria-orientation={orientation}> {/* Applied jules-stepper and orientation class to OL */}
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep;

          const isDisabled =
            canNavigate && !canNavigate(index, true) && index !== currentStep;

          let itemClasses = 'jules-stepper-item';
          if (isActive) {
            itemClasses += ' jules-stepper-item-active';
          } else if (isComplete) {
            itemClasses += ' jules-stepper-item-completed';
          } else {
            itemClasses += ' jules-stepper-item-inactive'; // Or rely on default jules-stepper-item styling
          }

          // Add disabled class if navigation is not allowed
          if (canNavigate && !canNavigate(index, true) && index !== currentStep) {
            itemClasses += ' jules-stepper-item-disabled';
          }

          // A connector leading to the current step (index) is filled if this step is active or completed,
          // and it's not the first step.
          const isConnectorFilled = (isActive || isComplete) && index > 0;
          if (isConnectorFilled && isHorizontal) { // Only apply for horizontal stepper
            itemClasses += ' is-connector-filled';
          }

          return (
            <li
              key={step.id}
              className={itemClasses}
              onClick={() => handleClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-current={isActive ? 'step' : undefined}
              aria-disabled={isDisabled ? 'true' : undefined}
              role="button"
              tabIndex={isDisabled ? -1 : 0}
            >
              <div className="jules-stepper-item-content">
                <span className="jules-stepper-icon">
                  {isComplete ? '✓' : isActive ? '▶' : index + 1}{' '}
                  {/* Display number for inactive steps */}
                </span>
                <span className="jules-stepper-label">{step.title}</span>
              </div>
            </li>
          );
        })}
        </ol>
      </nav>
      {requiredDocs.length > 0 && (
        <div className="jules-stepper-required-docs">
          {/* The h5 should pick up styles from jules_base.css or could be jules-text-color-headings */}
          <h5>Required Documents</h5>
          <ul> {/* ul/li should pick up styles from jules_base.css */}
            {requiredDocs.map((doc) => (
              <li key={doc}>{doc}</li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
