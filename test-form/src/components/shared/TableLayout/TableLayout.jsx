import React, { useEffect, useState } from 'react';

export default function TableLayout({ fields = [], formData = {}, onChange, errors = {}, ui = {} }) {
  const [copySourceDay, setCopySourceDay] = useState('');
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(max-width: 768px)');
    const handle = (e) => setIsNarrow(e.matches);
    setIsNarrow(mq.matches);
    if (mq.addEventListener) {
      mq.addEventListener('change', handle);
    } else {
      mq.addListener(handle);
    }
    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', handle);
      } else {
        mq.removeListener(handle);
      }
    };
  }, []);

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
  const maxColumns = ui.maxColumns || columnHeaders.length;
  const showCollapsed = isNarrow && columnHeaders.length > maxColumns;

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
            <th>{ui.rowHeaderLabel || 'Day'}</th>{' '}
            {columnHeaders
              .slice(0, showCollapsed ? maxColumns : columnHeaders.length)
              .map((h, i) => (
                <th key={`th-${i}`}>{h}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedRows).map(([rowLabel, rowFields], rowIdx) => {
            const sorted = rowFields.slice().sort((a, b) => (a.ui?.column || 0) - (b.ui?.column || 0));
            const visibleFields = showCollapsed ? sorted.slice(0, maxColumns) : sorted;
            const hiddenFields = showCollapsed ? sorted.slice(maxColumns) : [];
            return (
              <React.Fragment key={`frag-${rowIdx}`}>
                <tr key={`tr-${rowIdx}`}>
                  <td>{rowLabel}</td>
                  {visibleFields.map((field, colIdx) => {
                    const id = field.id;
                    const val = formData[id] || '';
                    const err = errors[id];
                    const header = columnHeaders[(field.ui?.column || colIdx + 1) - 1] || field.label;
                    return (
                      <td key={`td-${rowIdx}-${colIdx}`} data-label={header}>
                        <input
                          type={field.type || 'text'}
                          name={id}
                          placeholder={field.ui?.placeholder || ''}
                          value={val}
                          onChange={(e) => onChange && onChange(id, e.target.value)}
                          className={`jules-input ${err ? 'jules-input-error' : ''}`}
                        />
                        {err && (
                          <div
                            id={`${id}-error`}
                            className="jules-alert jules-alert-error jules-input-error-message"
                            style={{ fontSize: 'var(--jules-font-size-xs)', padding: 'var(--jules-space-xxs)' }}
                            tabIndex="-1"
                          >
                            {err}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
                {showCollapsed && hiddenFields.length > 0 && (
                  <tr className="jules-tablelayout-collapsed-row" key={`extra-${rowIdx}`}>
                    <td colSpan={maxColumns + 1}>
                      {hiddenFields.map((field, idx) => {
                        const id = field.id;
                        const val = formData[id] || '';
                        const err = errors[id];
                        const header = columnHeaders[(field.ui?.column || maxColumns + idx + 1) - 1] || field.label;
                        return (
                          <div key={`extra-${rowIdx}-${idx}`} className="jules-tablelayout-hidden-field">
                            <label className="jules-label" htmlFor={id}>{header}</label>
                            <input
                              id={id}
                              type={field.type || 'text'}
                              name={id}
                              placeholder={field.ui?.placeholder || ''}
                              value={val}
                              onChange={(e) => onChange && onChange(id, e.target.value)}
                              className={`jules-input ${err ? 'jules-input-error' : ''}`}
                            />
                            {err && (
                              <div
                                id={`${id}-error`}
                                className="jules-alert jules-alert-error jules-input-error-message"
                                style={{ fontSize: 'var(--jules-font-size-xs)', padding: 'var(--jules-space-xxs)' }}
                                tabIndex="-1"
                              >
                                {err}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
