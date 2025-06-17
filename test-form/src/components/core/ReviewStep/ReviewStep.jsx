import React from 'react';

export default function ReviewStep({ steps = [], stepData = {}, onEdit, onSubmit }) {
  return (
    <div className="review-step">
      <h2>Review &amp; Submit</h2>
      {steps.map((step, idx) => {
        if (step.type === 'review') return null;
        const isInfoOnly =
          Array.isArray(step.sections) &&
          step.sections.length > 0 &&
          step.sections.every(sec => sec.type === 'info');
        if (isInfoOnly) return null;
        const data = stepData[step.id] || {};
        return (
          <div key={step.id} className="review-section">
            <h3>{step.title}</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <button type="button" onClick={() => onEdit(idx)}>
              Edit
            </button>
          </div>
        );
      })}
      <button type="button" onClick={onSubmit} className="submit-button">
        Submit Application
      </button>
    </div>
  );
}
