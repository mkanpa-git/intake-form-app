import React, { useState, useEffect } from 'react';
import TextInput from '../TextInput/TextInput';
import SelectField from '../SelectField/SelectField';
import RadioGroup from '../RadioGroup/RadioGroup';
import FileInput from '../FileInput/FileInput';
import MaskedInput from '../MaskedInput/MaskedInput';

export default function GroupField({ field, value = [], onChange }) {
  const [entries, setEntries] = useState(value);
  const [currentEntry, setCurrentEntry] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setEntries(Array.isArray(value) ? value : []);
  }, [value]);

  const handleInputChange = (id, val) => {
    setCurrentEntry((prev) => ({ ...prev, [id]: val }));
  };

  const handleSave = () => {
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
  };

  const renderField = (subField) => {
    const commonProps = {
      id: subField.id,
      label: subField.label,
      required: subField.required,
      value: currentEntry[subField.id] || '',
      onChange: (e) => handleInputChange(subField.id, e.target ? e.target.value : e),
    };
    switch (subField.type) {
      case 'select':
        return (
          <SelectField key={subField.id} options={subField.ui?.options || []} {...commonProps} />
        );
      case 'radio':
        return (
          <RadioGroup key={subField.id} options={subField.ui?.options || []} {...commonProps} />
        );
      case 'date':
      case 'time':
        return <TextInput key={subField.id} type={subField.type} {...commonProps} />;
      case 'file':
        return (
          <FileInput
            key={subField.id}
            multiple={subField.metadata?.multiple}
            {...commonProps}
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
            />
          );
        }
        return <TextInput key={subField.id} {...commonProps} />;
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
                  <td key={f.id}>{item[f.id]}</td>
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
