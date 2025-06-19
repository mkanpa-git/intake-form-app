import React, { useState } from 'react';
import Modal from '../../shared/Modal/Modal'; // Assuming Modal is already refactored
import Button from '../../shared/Button/Button'; // Import the new Button component
// import styles from './ReviewStep.module.css'; // Removed CSS Module import - likely redundant

function isObject(val) {
  return val && typeof val === 'object' && !Array.isArray(val);
}

function RenderValue({ value }) {
  if (Array.isArray(value)) {
    if (value.length > 0 && value.every(isObject)) {
      const columns = Array.from(
        value.reduce((set, item) => {
          Object.keys(item).forEach(k => set.add(k));
          return set;
        }, new Set())
      );
      return (
        // Using jules-tablelayout-table for consistency, or a specific jules-review-data-table if more tailored styles are needed
        <table className="jules-tablelayout-table jules-review-data-table">
          <thead>
            <tr>{columns.map(c => (<th key={c}>{c}</th>))}</tr>
          </thead>
          <tbody>
            {value.map((row, i) => (
              <tr key={i}>
                {columns.map(col => (
                  <td key={col}>
                    <RenderValue value={row[col]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return (
      // Using a generic list style, jules_base.css should handle ul/li
      <ul className="jules-list-styled">
        {value.map((v, i) => (
          <li key={i}>{String(v)}</li>
        ))}
      </ul>
    );
  }
  if (isObject(value)) {
    // Pass a prop to indicate this is a nested table for styling if needed
    return <RenderData data={value} isNestedTable={true} />;
  }
  // Render simple values directly, jules_base.css handles span
  return String(value);
}

function RenderData({ data, isNestedTable }) {
  // Use different class for nested tables if they need different styling (e.g. no shadow, less padding)
  const tableClass = isNestedTable
    ? "jules-data-table-compact"
    : "jules-review-data-table"; // Main table for each section's data

  return (
    <div className={tableClass}> {/* Changed table to div for more flexible key-value pair grid styling */}
      {Object.entries(data).map(([k, v]) => (
        <div key={k} className="jules-review-data-row">
          <span className="jules-review-data-label">{k}</span>
          <div className="jules-review-data-value">
            <RenderValue value={v} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReviewStep({ steps = [], stepData = {}, onEdit, onSubmit, isSubmitting }) { // Added isSubmitting prop
  const [jsonIndex, setJsonIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleOpenModal = (index) => {
    setJsonIndex(index);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setJsonIndex(null); // Reset index when modal closes
  }

  return (
    <div className="jules-review-step">
      {/* h2 will be styled by jules_base.css */}
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
          // Using jules-section for consistency, or jules-review-section if more specific styling is needed
          <div key={step.id} className="jules-section jules-review-section">
            <div className="jules-section-header jules-review-section-header"> {/* Added header for title and edit button */}
              <h3 className="jules-section-title">{step.title}</h3>
              <div>
                <Button
                  variant="tertiary"
                  size="small"
                  onClick={() => onEdit(idx)}
                  iconLeft="✎"
                  style={{marginRight: 'var(--jules-space-sm)'}}
                >
                  Edit
                </Button>
                <Button
                  variant="tertiary"
                  size="small"
                  onClick={() => handleOpenModal(idx)}
                  iconLeft="📄"
                >
                  View as JSON
                </Button>
              </div>
            </div>
            <div className="jules-section-content">
              <RenderData data={data} />
            </div>
          </div>
        );
      })}
      <div className="jules-step-navigation" style={{marginTop: 'var(--jules-space-xl)'}}>
        <Button
          variant="primary"
          onClick={onSubmit}
          iconRight="✓"
          isLoading={isSubmitting} // Pass isSubmitting to isLoading prop
        >
          Submit Application
        </Button>
      </div>
      {jsonIndex !== null && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={`JSON Data: ${steps[jsonIndex]?.title || 'Data'}`} // Use optional chaining for title
        >
          <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>{JSON.stringify(stepData[steps[jsonIndex]?.id] || {}, null, 2)}</pre>
        </Modal>
      )}
    </div>
  );
}
