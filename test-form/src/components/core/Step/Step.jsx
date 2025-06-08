import React, { useState, useEffect } from 'react';
import {
  validateStep,
  validateField,
  evaluateCondition,
  cleanupHiddenFields,
} from '../../../utils/formHelpers';
import Section from '../Section/Section';
import InfoSection from '../InfoSection/InfoSection';
import TextInput from '../../shared/TextInput/TextInput';
import SelectField from '../../shared/SelectField/SelectField';
import RadioGroup from '../../shared/RadioGroup/RadioGroup';
import CheckboxGroup from '../../shared/CheckboxGroup/CheckboxGroup';
import GroupField from '../../shared/GroupField/GroupField';
import TableLayout from '../../shared/TableLayout/TableLayout';
import MaskedInput from '../../shared/MaskedInput/MaskedInput';
import FileInput from '../../shared/FileInput/FileInput';
import AddressAutocomplete from '../../shared/AddressAutocomplete';
import ReactMarkdown from 'react-markdown';
import styles from './Step.module.css';

export default function Step({
  title,
  sections = [],
  onNext,
  onBack,
  isFirst = false,
  isLast = false,
  formData: initialData = {},
  fullData = {},
  onDataChange,
}) {
  const [collapsedSections, setCollapsedSections] = useState({});
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Update local form data when parent data changes (e.g., returning to a step)
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Initialize collapsed sections based on defaultCollapsed when sections change
  useEffect(() => {
    const initial = {};
    sections.forEach((sec) => {
      if (sec.ui?.collapsible && sec.ui.defaultCollapsed) {
        initial[sec.id] = true;
      }
    });
    setCollapsedSections(initial);
  }, [sections]);

  // Clear section-level errors when required group sections gain data
  useEffect(() => {
    setErrors((prev) => {
      const updated = { ...prev };
      sections.forEach((sec) => {
        if (!sec.required || !updated[sec.id]) return;
        const hasGroupData = sec.fields?.some(
          (f) => f.type === 'group' && Array.isArray(fullData[f.id]) && fullData[f.id].length > 0
        );
        if (hasGroupData) {
          delete updated[sec.id];
        }
      });
      return updated;
    });
  }, [sections, fullData]);

  // Re-run validation when returning to this step if fields were previously touched
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const result = validateStep(
        { sections },
        formData,
        errors,
        touched
      );
      setErrors(result.errors);
      setTouched(result.touched);
    }
  }, [sections]);

  const handleToggle = (id) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const findFieldById = (searchId) => {
    for (const sec of sections) {
      if (sec.id === searchId) return sec;
      if (Array.isArray(sec.fields)) {
        const stack = [...sec.fields];
        while (stack.length) {
          const f = stack.shift();
          if (f.id === searchId) return f;
          if (f.type === 'group' && Array.isArray(f.fields)) {
            stack.push(...f.fields);
          }
        }
      }
    }
    return null;
  };

  const handleChange = (id, value) => {
    setFormData(prev => {
      const next = { ...prev, [id]: value };
      onDataChange?.(next);
      setTouched(tPrev => ({ ...tPrev, [id]: true }));

      const field = findFieldById(id);
      if (field) {
        const err = validateField(field, value, { ...fullData, ...next });
        setErrors(ePrev => {
          const updated = { ...ePrev, [id]: err };
          if (!err) delete updated[id];
          return updated;
        });
      }
      return next;
    });
  };

  const groupFieldsByGroup = (fields = []) => {
    const grouped = {};
    fields.forEach((f) => {
      const group = f.ui?.group || 'default';
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(f);
    });
    return grouped;
  };

  const renderField = (field) => {
    const conditionToCheck =
      field.visibilityCondition ??
      (field.requiredCondition?.condition || field.requiredCondition);
    const visible = conditionToCheck
      ? evaluateCondition(conditionToCheck, fullData)
      : true;
    const isRequired = field.requiredCondition
      ? evaluateCondition(
          field.requiredCondition.condition || field.requiredCondition,
          fullData
        )
      : field.required;

    if (!visible) return null;

    const error = touched[field.id] ? errors[field.id] : undefined;

    if (
      field.type === 'tel' ||
      field.id.includes('telephone') ||
      (typeof field.label === 'string' && field.label.toLowerCase().includes('phone'))
    ) {
      return (
        <MaskedInput
          key={field.id}
          id={field.id}
          label={field.label}
          mask="(000) 000-0000"
          placeholder={field.ui?.placeholder || '(123) 456-7890'}
          required={isRequired}
          value={formData[field.id] || ''}
          onChange={(val) => handleChange(field.id, val)}
          error={error}
        />
      );
    }

    const isStreet =
      field.id === 'street' ||
      (typeof field.label === 'string' && field.label.toLowerCase().includes('street address'));

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'time':
        if (
          field.id === 'ssn' ||
          (typeof field.label === 'string' &&
            field.label.toLowerCase().includes('social security'))
        ) {
          return (
            <MaskedInput
              key={field.id}
              id={field.id}
              label={field.label}
              mask="000-00-0000"
              placeholder="123-45-6789"
              required={isRequired}
              value={formData[field.id] || ''}
              onChange={(val) => handleChange(field.id, val)}
              error={error}
            />
          );
        }
        if (isStreet) {
          return (
            <>
              <AddressAutocomplete
                key={field.id}
                id={field.id}
                label={field.label}
                required={isRequired}
                value={formData[field.id] || ''}
                onChange={(val) => handleChange(field.id, val)}
                onAddressSelect={(addr) => {
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
                  handleChange(field.id, addr.formatted_address || addr.formattedAddress || '');
                  if (findFieldById('city')) {
                    handleChange('city', comps.locality?.long_name || comps.locality?.longName || '');
                  }
                  if (findFieldById('state')) {
                    handleChange(
                      'state',
                      comps.administrative_area_level_1?.short_name || comps.administrativeAreaLevel1?.shortName || ''
                    );
                  }
                  if (findFieldById('zip_code')) {
                    handleChange('zip_code', comps.postal_code?.long_name || comps.postalCode?.longName || '');
                  }
                  if (
                    findFieldById('latitude') &&
                    addr.location?.latitude !== undefined
                  ) {
                    handleChange('latitude', addr.location.latitude);
                  }
                  if (
                    findFieldById('longitude') &&
                    addr.location?.longitude !== undefined
                  ) {
                    handleChange('longitude', addr.location.longitude);
                  }
                }}
              />
              {error && <div className="form-error-alert">{error}</div>}
            </>
          );
        }
        return (
          <>
            <TextInput
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              required={isRequired}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
            {error && <div className="form-error-alert">{error}</div>}
          </>
        );
      case 'select':
        if (field.metadata?.multiple) {
          return (
            <>
              <SelectField
                key={field.id}
                id={field.id}
                label={field.label}
                options={field.ui?.options || []}
                required={isRequired}
                multiple
                minSelections={field.constraints?.minSelections}
                maxSelections={field.constraints?.maxSelections}
                value={formData[field.id] || []}
                onChange={(e) =>
                  handleChange(
                    field.id,
                    Array.from(e.target.selectedOptions).map((opt) => opt.value)
                  )
                }
              />
              {error && <div className="form-error-alert">{error}</div>}
            </>
          );
        }
        return (
          <>
            <SelectField
              key={field.id}
              id={field.id}
              label={field.label}
              options={field.ui?.options || []}
              required={isRequired}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
            {error && <div className="form-error-alert">{error}</div>}
          </>
        );
      case 'radio':
        return (
          <>
            <RadioGroup
              key={field.id}
              id={field.id}
              label={field.label}
              options={field.ui?.options || []}
              required={isRequired}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
            {error && <div className="form-error-alert">{error}</div>}
          </>
        );
      case 'checkbox':
        if (field.metadata?.multiple) {
          return (
            <>
              <CheckboxGroup
                key={field.id}
                id={field.id}
                label={field.label}
                options={field.ui?.options || []}
                value={formData[field.id] || []}
                onChange={(val) => handleChange(field.id, val)}
                required={isRequired}
              />
              {error && <div className="form-error-alert">{error}</div>}
            </>
          );
        }
        return (
          <>
            <input
              key={field.id}
              type="checkbox"
              id={field.id}
              checked={!!formData[field.id]}
              onChange={(e) => handleChange(field.id, e.target.checked)}
              required={isRequired}
            />
            {field.label && <label htmlFor={field.id}>{field.label}</label>}
            {error && <div className="form-error-alert">{error}</div>}
          </>
        );
      case 'date':
        return (
          <>
            <TextInput
              key={field.id}
              id={field.id}
              label={field.label}
              type="date"
              required={isRequired}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
            {error && <div className="form-error-alert">{error}</div>}
          </>
        );
      case 'file':
        return (
          <FileInput
            key={field.id}
            id={field.id}
            label={field.label}
            multiple={field.metadata?.multiple}
            required={isRequired}
            onChange={(val) => handleChange(field.id, val)}
            hint={Array.isArray(field.metadata?.examples)
              ? `Examples: ${field.metadata.examples.join(', ')}`
              : field.metadata?.examples}
            error={error}
          />
        );
      case 'group':
        return (
          <GroupField
            key={field.id}
            field={field}
            value={formData[field.id] || []}
            onChange={(val) => handleChange(field.id, val)}
            fullData={fullData}
          />
        );
      default:
        if (
          field.id === 'ssn' ||
          (typeof field.label === 'string' &&
            field.label.toLowerCase().includes('social security'))
        ) {
          return (
            <MaskedInput
              key={field.id}
              id={field.id}
              label={field.label}
              mask="000-00-0000"
              placeholder="123-45-6789"
              required={isRequired}
              value={formData[field.id] || ''}
              onChange={(val) => handleChange(field.id, val)}
              error={error}
            />
          );
        }
        return (
          <>
            <TextInput
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              required={isRequired}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
            {error && <div className="form-error-alert">{error}</div>}
          </>
        );
    }
  };

  const sectionHasMissing = (section) => {
    if (!Array.isArray(section.fields)) return false;
    return section.fields.some((f) => {
      const value = formData[f.id];
      const { required, requiredCondition } = f;

      let isRequired = false;
      if (
        requiredCondition &&
        (requiredCondition.condition ||
          (requiredCondition.field && requiredCondition.operator))
      ) {
        isRequired = evaluateCondition(
          requiredCondition.condition || requiredCondition,
          fullData
        );
      } else if (typeof required === "boolean") {
        isRequired = required;
      }

      return (
        isRequired &&
        (value === undefined ||
          value === null ||
          (typeof value === "string" && value === "") ||
          (Array.isArray(value) && value.length === 0))
      );
    });
  };

  const handleNextClick = () => {
    const result = validateStep(
      { sections },
      { ...formData },
      errors,
      touched
    );
    setErrors(result.errors);
    setTouched(result.touched);
    if (!result.valid) return;
    const cleaned = cleanupHiddenFields({ sections }, formData);
    setFormData(cleaned);
    onDataChange && onDataChange(cleaned);
    onNext && onNext(cleaned);
  };

  const handleBackClick = () => {
    const result = validateStep(
      { sections },
      { ...formData },
      errors,
      touched
    );
    setErrors(result.errors);
    setTouched(result.touched);
    onBack && onBack(formData);
  };

  return (
    <div className={styles.step}>
      <h2>{title}</h2>
      {sections.map((sec) => {
        const collapsed = collapsedSections[sec.id] || false;
        if (sec.type === 'info' || (!sec.fields && sec.content)) {
          return (
            <InfoSection
              key={sec.id}
              title={sec.title}
              content={sec.content}
              ui={sec.ui}
              collapsed={collapsed}
              onToggle={() => handleToggle(sec.id)}
            />
          );
        }
        return (
          <Section
            key={sec.id}
            title={sec.title}
            required={sec.required}
            isCollapsed={collapsed}
            onToggle={() => handleToggle(sec.id)}
            showAlert={sectionHasMissing(sec)}
          >
            {sec.content && <ReactMarkdown>{sec.content}</ReactMarkdown>}
            {errors[sec.id] && (
              <div className="form-error-alert">{errors[sec.id]}</div>
            )}
            {sec.type === 'group' ? (
              <GroupField
                field={sec}
                value={formData[sec.id] || []}
                onChange={(val) => handleChange(sec.id, val)}
                fullData={fullData}
              />
            ) : sec.ui?.layout === 'table' ? (
              <TableLayout
                fields={sec.fields || []}
                formData={formData}
                onChange={handleChange}
                errors={errors}
                ui={sec.ui}
              />
            ) : (
              (() => {
                const grouped = groupFieldsByGroup(sec.fields || []);
                const entries = Object.entries(grouped);
                const groups = entries.map(([groupKey, groupFields], idx) => (
                  <div
                    key={`${sec.id}-${groupKey}-${idx}`}
                    className="form-group-wrapper group-col"
                  >
                    {groupKey !== 'default' && (
                      <div className="form-group-heading">
                        {groupFields[0].ui?.groupLabel || groupKey}
                        {groupFields[0].ui?.optionalGroup && (
                          <span className="text-sm text-gray-500 ml-2">(Optional)</span>
                        )}
                      </div>
                    )}
                    <div className="form-subgroup-grid grid gap-4">
                      {groupFields.map((field) => renderField(field))}
                    </div>
                  </div>
                ));
                return entries.length > 1 ? (
                  <div className="group-columns">{groups}</div>
                ) : (
                  groups
                );
              })()
            )}
          </Section>
        );
      })}
      <div className={styles.navigation}>
        {!isFirst && (
          <button type="button" onClick={handleBackClick}>
            Back
          </button>
        )}
        {!isLast && (
          <button type="button" onClick={handleNextClick}>
            Next
          </button>
        )}
        {isLast && <button type="button">Submit</button>}
      </div>
    </div>
  );
}
