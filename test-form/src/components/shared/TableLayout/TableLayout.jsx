import React, { useState } from 'react';

export default function TableLayout({ fields = [], formData = {}, onChange, errors = {}, ui = {} }) {
  const [copySourceDay, setCopySourceDay] = useState('');

  const groupedRows = fields.reduce((acc, field) => {
    const row = field.ui?.rowGroup || 'default';
    acc[row] = acc[row] || [];
    acc[row].push(field);
    return acc;
  }, {});

  const handleCopySchedule = () => {
    const { rowCopy } = ui || {};
    if (!rowCopy || !copySourceDay) return;

    const sourceFields = fields.filter(
      (f) => f.ui?.rowGroup === copySourceDay && rowCopy.fieldsToCopy.includes(f.ui?.column)
    );

    const sourceValues = Object.fromEntries(
      sourceFields.map((f) => [f.ui?.column, formData[f.id]])
    );

    rowCopy.targetRowValues.forEach((row) => {
      if (row === copySourceDay) return;
      fields.forEach((field) => {
        if (field.ui?.rowGroup === row && rowCopy.fieldsToCopy.includes(field.ui?.column)) {
          const val = sourceValues[field.ui?.column];
          if (val !== undefined) {
            onChange && onChange(field.id, val);
          }
        }
      });
    });
  };

  const columnHeaders = ui.columns || [];

  return (
    <div className="jules-tablelayout">
      {ui.rowCopy?.enableUserPickSource && (
        <div className="jules-table-copy-controls">
          <label htmlFor="jules-copy-source-day" className="jules-label"> {/* Added htmlFor and class */}
            Copy schedule from:
          </label>
          <select
            id="jules-copy-source-day"
            className="jules-input"  // Added class
            value={copySourceDay}
            onChange={(e) => setCopySourceDay(e.target.value)}
            style={{ width: 'auto', display: 'inline-block', marginRight: 'var(--jules-space-sm)' }} // Retained some inline style for demo convenience
          >
            <option value="">Select row</option>
            {ui.rowCopy.sourceOptions.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <button
            type="button"
            className="jules-button jules-button-secondary jules-button-small" // Added classes
            onClick={handleCopySchedule}
            disabled={!copySourceDay}
          >
            {ui.rowCopy.copyControlLabel || 'Copy row'}
          </button>
        </div>
      )}
      <table className="jules-tablelayout-table">
        <thead>
          <tr>
            <th>{ui.rowHeaderLabel || 'Day'}</th> {/* Allow row header label to be configurable */}
            {columnHeaders.map((h, i) => (
              <th key={`th-${i}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedRows).map(([rowLabel, rowFields], rowIdx) => {
            const sorted = rowFields.slice().sort((a, b) => (a.ui?.column || 0) - (b.ui?.column || 0));
            return (
              <tr key={`tr-${rowIdx}`}>
                <td>{rowLabel}</td>
                {sorted.map((field, colIdx) => {
                  const id = field.id;
                  const val = formData[id] || '';
                  const err = errors[id];
                  return (
                    <td key={`td-${rowIdx}-${colIdx}`}>
                      <input
                        type={field.type || 'text'}
                        name={id}
                        placeholder={field.ui?.placeholder || ''}
                        value={val}
                        onChange={(e) => onChange && onChange(id, e.target.value)}
                        className={`jules-input ${err ? 'jules-input-error' : ''}`} // Added jules-input classes
                      />
                      {/* Assuming error display is desired directly in cell, could be noisy.
                          Alternatively, errors could be summarized elsewhere or indicated by border only. */}
                      {err && <div className="jules-alert jules-alert-error jules-input-error-message" style={{fontSize: 'var(--jules-font-size-xs)', padding: 'var(--jules-space-xxs)'}}>{err}</div>}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
