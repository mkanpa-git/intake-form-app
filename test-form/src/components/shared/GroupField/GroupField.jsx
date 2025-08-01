import React, { useState, useEffect } from 'react';
import TextInput from '../TextInput/TextInput';
import SelectField from '../SelectField/SelectField';
import RadioGroup from '../RadioGroup/RadioGroup';
import CheckboxGroup from '../CheckboxGroup/CheckboxGroup';
import FileInput from '../FileInput/FileInput';
import MaskedInput from '../MaskedInput/MaskedInput';
import AddressAutocomplete from '../AddressAutocomplete';
import { useTranslation } from 'react-i18next';
import Button from '../Button/Button'; // Import the new Button component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPen,
  faTrash,
  faPlus,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { evaluateCondition } from '../../../utils/formHelpers';

const BOROUGH_MAP = {
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

const getByPath = (obj, path) =>
  path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);

export default function GroupField({ field, value = [], onChange, fullData = {} }) {
  const { t } = useTranslation();
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

  const handleAddressAutofill = (addr, subField) => {
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

    const targets = field.metadata?.autofillTargets || [];
    targets.forEach((t) => {
      let val;
      if (t.source?.includes('.')) {
        val = getByPath(addr, t.source);
      } else {
        val = comps[t.source]?.long_name || comps[t.source]?.longName;
        if (!val && Array.isArray(t.fallbackSources)) {
          for (const fs of t.fallbackSources) {
            val = comps[fs]?.long_name || comps[fs]?.longName;
            if (val) break;
          }
        }
      }
      if (val !== undefined && t.mapping === 'boroughMap') {
        val = BOROUGH_MAP[String(val).trim().toLowerCase()] || val;
      }
      if (val !== undefined) {
        handleInputChange(t.fieldId, val);
      }
    });

    const streetOnly = fullAddr.split(',')[0];
    handleInputChange(subField.id, streetOnly);
  };

  const validateEntry = () => {
    const errors = {};
    (field.fields || []).forEach((subField) => {
      const required = subField.requiredCondition
        ? evaluateCondition(subField.requiredCondition, fullData)
        : subField.required;
      const val = currentEntry[subField.id];
      if (
        required &&
        (val === undefined ||
          val === null ||
          (typeof val === 'string' && val.trim() === '') ||
          (Array.isArray(val) && val.length === 0))
      ) {
        errors[subField.id] = t('requiredField', { field: subField.label });
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
    const conditionToCheck = subField.visibilityCondition ?? subField.requiredCondition;
    const visible = conditionToCheck
      ? evaluateCondition(conditionToCheck, fullData)
      : true;
    const required = subField.requiredCondition
      ? evaluateCondition(subField.requiredCondition, fullData)
      : subField.required;
    if (!visible) return null;

    const commonProps = {
      id: subField.id,
      label: subField.label,
      tooltip: subField.tooltip,
      required,
      value: currentEntry[subField.id] || '',
      onChange: (e) => handleInputChange(subField.id, e.target ? e.target.value : e),
    };
    const error = entryErrors[subField.id];
    const isStreet =
      subField.id === 'street' ||
      (typeof subField.label === 'string' &&
        subField.label.toLowerCase().includes('street address'));
    const isAddressField =
      (field.ui?.overrideComponent === 'AddressAutocomplete' &&
        field.ui?.autocomplete === subField.id) ||
      subField.type === 'address' ||
      isStreet;
    switch (subField.type) {
      case 'select':
        return (
          <>
            <SelectField
              key={subField.id}
              options={subField.ui?.options || []}
              placeholder={subField.ui?.placeholder}
              {...commonProps}
              error={error} // Pass error to SelectField
            />
            {/* Error display handled by SelectField internally now */}
          </>
        );
      case 'radio':
        return (
          <>
            <RadioGroup key={subField.id} options={subField.ui?.options || []} {...commonProps} error={error} />
            {/* Error display handled by RadioGroup internally now */}
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
              {...commonProps}
              error={error} // Pass error to CheckboxGroup
            />
            {/* Error display handled by CheckboxGroup internally now */}
          </>
        );
      case 'date':
      case 'time':
        return (
          <>
            <TextInput key={subField.id} type={subField.type} {...commonProps} error={error} />
            {/* Error display handled by TextInput internally now */}
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
        if (isAddressField) {
          return (
            <>
              <AddressAutocomplete
                key={subField.id}
                {...commonProps}
                placeholder={
                  placeholders[subField.id] ||
                  field.ui?.placeholder ||
                  subField.ui?.placeholder ||
                  ''
                }
                onChange={(val) => handleInputChange(subField.id, val)}
                onAddressSelect={(addr) => handleAddressAutofill(addr, subField)}
                error={error}
              />
              {error && (
                <div
                  id={`${subField.id}-error`}
                  className="jules-alert jules-alert-error jules-input-error-message"
                  tabIndex="-1"
                >
                  {error}
                </div>
              )}
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
            <TextInput key={subField.id} {...commonProps} error={error} />
            {/* Error display handled by TextInput internally now */}
          </>
        );
    }
  };

  const tableColumnIds = field.metadata?.tableColumns;
  const tableFields = tableColumnIds
    ? tableColumnIds
        .map((id) => field.fields.find((f) => f.id === id))
        .filter(Boolean)
    : field.fields;

  return (
    <div className="jules-groupfield">
      <h3 className="jules-groupfield-title">{field.label}</h3> {/* Changed h4 to h3 and added class */}
      {entries.length > 0 && (
        <table className="jules-groupfield-table">
          <thead>
            <tr>
              {tableFields.map((f) => (
                <th key={f.id}>{f.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((item, idx) => (
              <tr key={idx}>
                {tableFields.map((f) => (
                  <td key={f.id} data-label={f.label}>
                    {Array.isArray(item[f.id]) ? item[f.id].join(', ') : item[f.id]}
                  </td>
                ))}
                <td className="jules-groupfield-actions">
                  <Button
                    variant="tertiary"
                    size="small"
                    onClick={() => handleEdit(idx)}
                    iconLeft={<FontAwesomeIcon icon={faPen} aria-hidden="true" />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleDelete(idx)}
                    iconLeft={<FontAwesomeIcon icon={faTrash} aria-hidden="true" />}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!showForm && (
        <Button
          variant="secondary"
          onClick={() => { setShowForm(true); setEditingIndex(null); setCurrentEntry({}); }}
          iconLeft={<FontAwesomeIcon icon={faPlus} aria-hidden="true" />}
          style={{ marginTop: entries.length > 0 ? 'var(--jules-space-md)' : '0' }}
        >
          Add {field.label}
        </Button>
      )}
      {showForm && (
        <div className="jules-groupfield-entry-form">
          <h3>{editingIndex !== null ? `Edit ${field.label}` : `Add New ${field.label}`}</h3>
          {field.fields.map(renderField)}
          <div className="jules-form-actions">
            <Button
              variant="primary"
              onClick={handleSave}
              iconLeft={<FontAwesomeIcon icon={faCheck} aria-hidden="true" />}
            >
              Save
            </Button>
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}
