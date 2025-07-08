import React, { useState, useRef, useEffect } from 'react';
import Stepper from '../Stepper/Stepper';

export default function StepperDrawer({
  steps = [],
  currentStep = 0,
  onStepChange,
  requiredDocs = [],
  canNavigate,
  position = 'left',
}) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (open && drawerRef.current) {
      const firstFocusable = drawerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable && firstFocusable.focus();
    } else if (!open && toggleRef.current) {
      toggleRef.current.focus();
    }
  }, [open]);

  const handleStepChange = (idx) => {
    onStepChange && onStepChange(idx);
    setOpen(false);
  };

  return (
    <div className="stepper-drawer-container">
      <button
        ref={toggleRef}
        className="jules-button jules-button-secondary stepper-drawer-toggle"
        aria-controls="stepperDrawer"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        Steps
      </button>
      <div
        id="stepperDrawer"
        ref={drawerRef}
        className={`stepper-drawer ${open ? 'open' : ''} ${position}`}
        role="navigation"
      >
        <button
          className="jules-button jules-button-tertiary stepper-drawer-close"
          onClick={() => setOpen(false)}
        >
          Close
        </button>
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          requiredDocs={requiredDocs}
          orientation="vertical"
          canNavigate={canNavigate}
        />
      </div>
    </div>
  );
}
