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
    <div className="form-table-layout">
      {ui.rowCopy?.enableUserPickSource && (
        <div className="copy-controls">
          <label>
            Copy schedule from:
            <select value={copySourceDay} onChange={(e) => setCopySourceDay(e.target.value)}>
              <option value="">Select row</option>
              {ui.rowCopy.sourceOptions.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </label>
          <button type="button" onClick={handleCopySchedule} disabled={!copySourceDay}>
            {ui.rowCopy.copyControlLabel || 'Copy row'}
          </button>
        </div>
      )}
      <table className="form-table">
        <thead>
          <tr>
            <th>Day</th>
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
                        className={err ? 'error' : ''}
                      />
                      {err && <div className="form-error-alert">{err}</div>}
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
