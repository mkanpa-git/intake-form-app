import React, { useState } from 'react';
import Modal from '../../shared/Modal/Modal';
import styles from './ReviewStep.module.css';

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
        <table className={styles.table}>
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
      <ul className={styles.list}>
        {value.map((v, i) => (
          <li key={i}>{String(v)}</li>
        ))}
      </ul>
    );
  }
  if (isObject(value)) {
    return <RenderData data={value} />;
  }
  return <span>{String(value)}</span>;
}

function RenderData({ data }) {
  return (
    <table className={styles.dataTable}>
      <tbody>
        {Object.entries(data).map(([k, v]) => (
          <tr key={k}>
            <th>{k}</th>
            <td><RenderValue value={v} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ReviewStep({ steps = [], stepData = {}, onEdit, onSubmit }) {
  const [jsonIndex, setJsonIndex] = useState(null);

  return (
    <div className={styles.reviewStep}>
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
          <div key={step.id} className={styles.reviewSection}>
            <h3>{step.title}</h3>
            <RenderData data={data} />
            <button type="button" onClick={() => onEdit(idx)}>Edit</button>
            <button
              type="button"
              className={styles.viewJson}
              onClick={() => setJsonIndex(idx)}
            >
              View as JSON
            </button>
          </div>
        );
      })}
      <button type="button" onClick={onSubmit} className={styles.submitButton}>
        Submit Application
      </button>
      {jsonIndex !== null && (
        <Modal onClose={() => setJsonIndex(null)}>
          <h3>{steps[jsonIndex].title}</h3>
          <pre>{JSON.stringify(stepData[steps[jsonIndex].id] || {}, null, 2)}</pre>
        </Modal>
      )}
    </div>
  );
}
