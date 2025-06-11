import React, { useState, useEffect } from 'react';
import TextInput from '../TextInput/TextInput';
import SelectField from '../SelectField/SelectField';
import RadioGroup from '../RadioGroup/RadioGroup';
import CheckboxGroup from '../CheckboxGroup/CheckboxGroup';
import FileInput from '../FileInput/FileInput';
import MaskedInput from '../MaskedInput/MaskedInput';
import AddressAutocomplete from '../AddressAutocomplete';
import { evaluateCondition } from '../../../utils/formHelpers';

export default function GroupField({ field, value = [], onChange, fullData = {} }) {
  const [entries, setEntries] = useState(value);
  const [currentEntry, setCurrentEntry] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [entryErrors, setEntryErrors] = useState({});
  const [placeholders, setPlaceholders] = useState({});

  useEffect(() => {
    setEntries(Array.isArray(value) ? value : []);
  }, [value]);

  useEffect(() => {
    const hasValues = Object.values(currentEntry).some((val) =>
      val !== undefined &&
      val !== null &&
      !(typeof val === 'string'
        ? val.trim() === ''
        : Array.isArray(val) && val.length === 0)
    );
    if (!hasValues) {
      setEntryErrors({});
    }
  }, [currentEntry]);

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
    const isStreet =
      subField.id === 'street' ||
      (typeof subField.label === 'string' &&
        subField.label.toLowerCase().includes('street address'));
    switch (subField.type) {
      case 'select':
        return (
          <>
            <SelectField
              key={subField.id}
              options={subField.ui?.options || []}
              placeholder={subField.ui?.placeholder || `Select ${subField.label}`}
              {...commonProps}
            />
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
            description={subField.description}
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
        if (isStreet) {
          return (
            <>
              <AddressAutocomplete
                key={subField.id}
                {...commonProps}
                placeholder={placeholders[subField.id] || subField.ui?.placeholder || ''}
                onChange={(val) => handleInputChange(subField.id, val)}
                onAddressSelect={(addr) => {
                  const fullAddr = addr.formatted_address || addr.formattedAddress || '';
                  setPlaceholders((p) => ({ ...p, [subField.id]: fullAddr }));

                  const components = addr.address_components || addr.addressComponents || [];
                  const comps = {};
                  components.forEach((c) => {
                    c.types.forEach((t) => {
                      comps[t] = {
                        long_name: c.long_name || c.longName,
                        short_name: c.short_name || c.shortName,
                      };
                    });
                  });
                  if (field.fields.some((f) => f.id === 'city')) {
                    const cityVal =
                      comps.locality?.long_name ||
                      comps.locality?.longName ||
                      comps.postal_town?.long_name ||
                      comps.postalTown?.longName ||
                      comps.sublocality_level_1?.long_name ||
                      comps.sublocalityLevel1?.longName ||
                      comps.administrative_area_level_2?.long_name ||
                      comps.administrativeAreaLevel2?.longName ||
                      '';
                    handleInputChange('city', cityVal);
                  }
                  if (field.fields.some((f) => f.id === 'borough')) {
                    const boroughSource =
                      comps.sublocality_level_1?.long_name ||
                      comps.sublocalityLevel1?.longName ||
                      comps.administrative_area_level_2?.long_name ||
                      comps.administrativeAreaLevel2?.longName ||
                      '';
                    const boroughMap = {
                      bronx: 'Bronx',
                      'bronx county': 'Bronx',
                      brooklyn: 'Brooklyn',
                      'kings county': 'Brooklyn',
                      manhattan: 'Manhattan',
                      'new york': 'Manhattan',
                      'new york county': 'Manhattan',
                      queens: 'Queens',
                      'queens county': 'Queens',
                      'staten island': 'Staten Island',
                      'richmond county': 'Staten Island',
                    };
                    const bName = boroughMap[boroughSource.trim().toLowerCase()];
                    if (bName) {
                      handleInputChange('borough', bName);
                    }
                  }
                  if (field.fields.some((f) => f.id === 'state')) {
                    handleInputChange(
                      'state',
                      comps.administrative_area_level_1?.short_name || comps.administrativeAreaLevel1?.shortName || ''
                    );
                  }
                  if (field.fields.some((f) => f.id === 'zip_code')) {
                    handleInputChange('zip_code', comps.postal_code?.long_name || comps.postalCode?.longName || '');
                  }
                  if (field.fields.some((f) => f.id === 'latitude') && addr.location?.latitude !== undefined) {
                    handleInputChange('latitude', addr.location.latitude);
                  }
                  if (field.fields.some((f) => f.id === 'longitude') && addr.location?.longitude !== undefined) {
                    handleInputChange('longitude', addr.location.longitude);
                  }

                  const streetOnly = fullAddr.split(',')[0];
                  handleInputChange(subField.id, streetOnly);
                }}
              />
              {error && <div className="form-error-alert">{error}</div>}
            </>
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
                  <button className="button-secondary" onClick={() => handleDelete(idx)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button className="button-secondary" onClick={() => { setShowForm(true); setEditingIndex(null); setCurrentEntry({}); }}>
        Add {field.label}
      </button>
      {showForm && (
        <div className="group-entry-form">
          {field.fields.map(renderField)}
          <div className="form-actions">
            <button onClick={handleSave}>Save</button>
            <button className="button-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
