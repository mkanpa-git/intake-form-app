import React, { useState, useRef, useEffect } from 'react';
import Stepper from '../Stepper/Stepper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAnglesRight,
  faAnglesLeft,
  faBarsProgress,
} from '@fortawesome/free-solid-svg-icons';

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
      {!open && (
        <button
          className="stepper-drawer-handle"
          aria-label="Open step navigation"
          onClick={() => setOpen(true)}
        >
          <FontAwesomeIcon icon={faAnglesRight} />
        </button>
      )}
      <button
        ref={toggleRef}
        className="jules-button jules-button-secondary stepper-drawer-toggle"
        aria-controls="stepperDrawer"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <FontAwesomeIcon icon={faBarsProgress} aria-hidden="true" />
        <span className="sr-only">Toggle steps</span>
        <span aria-hidden="true"> Steps</span>
      </button>
      {open && (
        <div
          className="stepper-drawer-overlay open"
          onClick={() => setOpen(false)}
        />
      )}
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
          <FontAwesomeIcon icon={faAnglesLeft} aria-hidden="true" />
          <span className="sr-only">Close</span>
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
