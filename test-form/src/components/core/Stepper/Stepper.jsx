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
  // The <ul> itself might not need a specific class if .jules-stepper directly styles its child ul or if the items are direct children.
  // Assuming .jules-stepper is the ul, or it directly styles the ul.
  // For now, let's assume the containerClass is applied to the <aside> and the <ul> is part of its structure.
  // jules_stepper.css was designed with .jules-stepper as the main list (ul) container.
  // So, the <aside> might be a wrapper, and the <ul> inside gets the .jules-stepper classes.

  const handleClick = (idx) => {
    if (idx === currentStep) return;
    if (canNavigate && !canNavigate(idx)) return;
    onStepChange && onStepChange(idx);
  };

  return (
    // The <aside> can be a generic container; the <ul> inside will be the actual stepper component
    <aside className={isHorizontal ? 'jules-stepper-container-horizontal' : 'jules-stepper-container-vertical'}>
      <h4>Steps</h4> {/* This h4 might need jules styling or be removed if stepper design incorporates title */}
      <div className="jules-stepper-progress">
        Step {currentStep + 1} of {steps.length}
      </div>
      <ul className={containerClass}> {/* Applied jules-stepper and orientation class to UL */}
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep;
          const isInactive = !isActive && !isComplete;

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
              aria-current={isActive ? 'step' : undefined}
            >
              <div className="jules-stepper-item-content">
                <span className="jules-stepper-icon">
                  {isComplete ? '✓' : isActive ? '▶' : (index + 1)} {/* Display number for inactive steps */}
                </span>
                <span className="jules-stepper-label">{step.title}</span>
              </div>
            </li>
          );
        })}
      </ul>
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
