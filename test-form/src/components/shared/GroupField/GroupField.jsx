import React, { useState, useEffect } from 'react';
import TextInput from '../TextInput/TextInput';
import SelectField from '../SelectField/SelectField';
import RadioGroup from '../RadioGroup/RadioGroup';
import CheckboxGroup from '../CheckboxGroup/CheckboxGroup';
import FileInput from '../FileInput/FileInput';
import MaskedInput from '../MaskedInput/MaskedInput';
import { evaluateCondition } from '../../../utils/formHelpers';

export default function GroupField({ field, value = [], onChange, fullData = {} }) {
  const [entries, setEntries] = useState(value);
  const [currentEntry, setCurrentEntry] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [entryErrors, setEntryErrors] = useState({});

  useEffect(() => {
    setEntries(Array.isArray(value) ? value : []);
  }, [value]);

  const handleInputChange = (id, val) => {
    setCurrentEntry((prev) => ({ ...prev, [id]: val }));
    setEntryErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const validateEntry = () => {
    const errors = {};
    (field.fields || []).forEach((subField) => {
      const required = subField.requiredCondition
        ? evaluateCondition(
            subField.requiredCondition.condition || subField.requiredCondition,
            fullData
          )
        : subField.required;
      const val = currentEntry[subField.id];
      if (
        required &&
        (val === undefined ||
          val === null ||
          (typeof val === 'string' && val.trim() === '') ||
          (Array.isArray(val) && val.length === 0))
      ) {
        errors[subField.id] = `${subField.label} is required.`;
      }
    });
    return errors;
  };

  const handleSave = () => {
    const errs = validateEntry();
    setEntryErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const updated = [...entries];
    if (editingIndex !== null) {
      updated[editingIndex] = currentEntry;
    } else {
      updated.push(currentEntry);
    }
    setEntries(updated);
    onChange && onChange(updated);
    setCurrentEntry({});
    setEditingIndex(null);
    setShowForm(false);
  };

  const handleEdit = (idx) => {
    setCurrentEntry(entries[idx]);
    setEditingIndex(idx);
    setShowForm(true);
    setEntryErrors({});
  };

  const handleDelete = (idx) => {
    const updated = entries.filter((_, i) => i !== idx);
    setEntries(updated);
    onChange && onChange(updated);
  };

  const handleCancel = () => {
    setShowForm(false);
    setCurrentEntry({});
    setEditingIndex(null);
    setEntryErrors({});
  };

  const renderField = (subField) => {
    const conditionToCheck =
      subField.visibilityCondition ??
      (subField.requiredCondition?.condition || subField.requiredCondition);
    const visible = conditionToCheck
      ? evaluateCondition(conditionToCheck, fullData)
      : true;
    const required = subField.requiredCondition
      ? evaluateCondition(
          subField.requiredCondition.condition || subField.requiredCondition,
          fullData
        )
      : subField.required;
    if (!visible) return null;

    const commonProps = {
      id: subField.id,
      label: subField.label,
      required,
      value: currentEntry[subField.id] || '',
      onChange: (e) => handleInputChange(subField.id, e.target ? e.target.value : e),
    };
    const error = entryErrors[subField.id];
    switch (subField.type) {
      case 'select':
        return (
          <>
            <SelectField key={subField.id} options={subField.ui?.options || []} {...commonProps} />
            {error && <div className="form-error-alert">{error}</div>}
          </>
        );
      case 'radio':
        return (
          <>
            <RadioGroup key={subField.id} options={subField.ui?.options || []} {...commonProps} />
            {error && <div className="form-error-alert">{error}</div>}
          </>
        );
      case 'checkbox':
        return (
          <>
            <CheckboxGroup
              key={subField.id}
              options={subField.ui?.options || []}
              value={currentEntry[subField.id] || []}
              onChange={(val) => handleInputChange(subField.id, val)}
            />
            {error && <div className="form-error-alert">{error}</div>}
          </>
        );
      case 'date':
      case 'time':
        return (
          <>
            <TextInput key={subField.id} type={subField.type} {...commonProps} />
            {error && <div className="form-error-alert">{error}</div>}
          </>
        );
      case 'file':
        return (
          <FileInput
            key={subField.id}
            multiple={subField.metadata?.multiple}
            {...commonProps}
            error={error}
          />
        );
      default:
        if (
          subField.id === 'ssn' ||
          subField.label?.toLowerCase().includes('social security')
        ) {
          return (
            <MaskedInput
              key={subField.id}
              mask="000-00-0000"
              placeholder="123-45-6789"
              {...commonProps}
              error={error}
            />
          );
        }
        if (
          subField.type === 'tel' ||
          subField.id.includes('telephone') ||
          subField.label?.toLowerCase().includes('phone')
        ) {
          return (
            <MaskedInput
              key={subField.id}
              mask="(000) 000-0000"
              placeholder="(123) 456-7890"
              {...commonProps}
              error={error}
            />
          );
        }
        return (
          <>
            <TextInput key={subField.id} {...commonProps} />
            {error && <div className="form-error-alert">{error}</div>}
          </>
        );
    }
  };

  return (
    <div className="group-field">
      <h4>{field.label}</h4>
      {entries.length > 0 && (
        <table className="modern-table">
          <thead>
            <tr>
              {field.fields.map((f) => (
                <th key={f.id}>{f.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((item, idx) => (
              <tr key={idx}>
                {field.fields.map((f) => (
                  <td key={f.id}>
                    {Array.isArray(item[f.id]) ? item[f.id].join(', ') : item[f.id]}
                  </td>
                ))}
                <td>
                  <button onClick={() => handleEdit(idx)}>Edit</button>
                  <button onClick={() => handleDelete(idx)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={() => { setShowForm(true); setEditingIndex(null); setCurrentEntry({}); }}>
        Add {field.label}
      </button>
      {showForm && (
        <div className="group-entry-form">
          {field.fields.map(renderField)}
          <div className="form-actions">
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
