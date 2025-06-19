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
import Tooltip from '../../shared/Tooltip/Tooltip';
import ReactMarkdown from 'react-markdown';
// import styles from './Step.module.css'; // Removed CSS Module import

export default function Step({
  title,
  sections = [],
  onNext,
  onBack,
  onSaveDraft,
  isFirst = false,
  isLast = false,
  formData: initialData = {},
  fullData = {},
  onDataChange,
  applicationId,
  onBackToReview,
  validationAttempt, // Added new prop
}) {
  const [collapsedSections, setCollapsedSections] = useState({});
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [placeholders, setPlaceholders] = useState({});

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

  // Validate step data when the incoming data or sections change. Errors are stored
  // but fields aren't automatically marked as touched so they won't show messages
  // until the user interacts or attempts navigation.
  useEffect(() => {
    const result = validateStep(
      { sections },
      formData,
      {},
      {}
    );

    setErrors(result.errors || {});
    // Intentionally do not update `touched` here. Error messages should appear
    // only after a user interaction or a failed navigation attempt.

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, sections]);

  useEffect(() => {
    // Check timestamp to ensure it's a new validation attempt that failed
    // And that the errors are for the current step being displayed (though this component doesn't know current step directly, FormRenderer does)
    if (validationAttempt && validationAttempt.timestamp && Object.keys(validationAttempt.errors).length > 0) {
      // Merge errors and touched from validationAttempt into local state
      // We only update if there are actual errors from the attempt
      setErrors(prevErrors => ({ ...prevErrors, ...validationAttempt.errors }));
      setTouched(prevTouched => ({ ...prevTouched, ...validationAttempt.touched }));
    }
  }, [validationAttempt]); // Depend on the entire validationAttempt object

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

  const isSectionVisible = (section) => {
    if (!section) return true;
    return section.visibilityCondition
      ? evaluateCondition(section.visibilityCondition, fullData)
      : true;
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
              <React.Fragment key={field.id}>
                <AddressAutocomplete
                  id={field.id}
                  label={field.label}
                  required={isRequired}
                  value={formData[field.id] || ''}
                  placeholder={placeholders[field.id] || field.ui?.placeholder || ''}
                  onChange={(val) => handleChange(field.id, val)}
                onAddressSelect={(addr) => {
                  const fullAddr = addr.formatted_address || addr.formattedAddress || '';
                  setPlaceholders((p) => ({ ...p, [field.id]: fullAddr }));

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
                  if (findFieldById('city')) {
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
                    handleChange('city', cityVal);
                  }
                  if (findFieldById('borough')) {
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
                      handleChange('borough', bName);
                    }
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

                  const streetOnly = fullAddr.split(',')[0];
                  handleChange(field.id, streetOnly);
                }}
                error={error} // Pass error to AddressAutocomplete
                />
                {/* AddressAutocomplete does not currently use the error prop to display jules-alert, so keep this if needed */}
                {error && <div className="jules-alert jules-alert-error jules-input-error-message">{error}</div>}
              </React.Fragment>
            );
        }
        return (
          <TextInput
            key={field.id}
            id={field.id}
            label={field.label}
            tooltip={field.tooltip}
            type={field.type}
            required={isRequired}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            error={error} // Pass error prop
            // Hint prop can be added if field.description exists
          />
        );
      case 'select':
        if (field.metadata?.multiple) {
          return (
            <SelectField
              key={field.id}
              id={field.id}
              label={field.label}
              tooltip={field.tooltip}
              options={field.ui?.options || []}
              required={isRequired}
              multiple
              minSelections={field.constraints?.minSelections}
              maxSelections={field.constraints?.maxSelections}
              value={formData[field.id] || []}
              onChange={(e) => // For multi-select, value is an array of selected option values
                handleChange(
                  field.id,
                  Array.from(e.target.selectedOptions).map((opt) => opt.value)
                )
              }
              error={error} // Pass error prop
            />
          );
        }
        return (
          <SelectField
            key={field.id}
            id={field.id}
            label={field.label}
            tooltip={field.tooltip}
            options={field.ui?.options || []}
            placeholder={field.ui?.placeholder || `Select ${field.label}`}
            required={isRequired}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            error={error} // Pass error prop
          />
        );
      case 'radio':
        return (
          <RadioGroup
            key={field.id}
            id={field.id} // This id will be used as 'name' for radio inputs in RadioGroup
            label={field.label}
            tooltip={field.tooltip}
            options={field.ui?.options || []}
            required={isRequired}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)} // Assuming RadioGroup's onChange gives the value directly
            error={error} // Pass error prop
            layout={field.ui?.layout} // Pass layout if specified (e.g., 'horizontal')
          />
        );
      case 'checkbox':
        if (field.metadata?.multiple) { // This implies a CheckboxGroup
          return (
            <CheckboxGroup
              key={field.id}
              id={field.id} // Base for checkbox names/ids in CheckboxGroup
              label={field.label}
              tooltip={field.tooltip}
              options={field.ui?.options || []}
              value={formData[field.id] || []}
              onChange={(val) => handleChange(field.id, val)}
              required={isRequired}
              error={error} // Pass error prop
              layout={field.ui?.layout} // Pass layout
            />
          );
        }
        // This is for a single checkbox, not a group
        // Consider creating a dedicated SingleCheckbox component that uses jules styles
        // For now, rendering a basic one that might not fully align with jules custom checkbox styles
        return (
          <div className="jules-form-field"> {/* Wrap single checkbox for consistent layout */}
            <div className="jules-checkbox-option">
              <input
                key={field.id}
                type="checkbox"
                id={field.id}
                className="jules-checkbox-input" // Basic class, custom styling might need more structure
                checked={!!formData[field.id]}
                onChange={(e) => handleChange(field.id, e.target.checked)}
                required={isRequired}
              />
              <span className="jules-checkbox-custom"></span>
              {field.label && (
                <label htmlFor={field.id} className="jules-checkbox-label-text">
                  {field.label}
                  {/* Tooltip should ideally be part of the label text or handled by a wrapper */}
                  {field.tooltip && <Tooltip text={field.tooltip} />}
                </label>
              )}
            </div>
            {error && <div className="jules-alert jules-alert-error jules-input-error-message">{error}</div>}
          </div>
        );
      case 'date':
        return (
          <TextInput
            key={field.id}
            id={field.id}
            label={field.label}
            tooltip={field.tooltip}
            type="date"
            required={isRequired}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            error={error} // Pass error prop
          />
        );
      case 'file':
        return (
          <FileInput
            key={field.id}
            id={field.id}
            label={field.label}
            tooltip={field.tooltip}
            description={field.description}
            multiple={field.metadata?.multiple}
            required={isRequired}
            onChange={(val) => handleChange(field.id, val)}
            applicationId={applicationId}
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
              tooltip={field.tooltip}
              type={field.type} // Should be 'text' if not a specific input type
              required={isRequired}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              error={error} // Pass error prop
            />
          {/* Error display handled by TextInput internally */}
          </>
        );
    }
  };

  const sectionHasMissing = (section) => {
    if (!isSectionVisible(section) || !Array.isArray(section.fields)) return false;
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

  const handleBackToReviewClick = () => {
    const result = validateStep(
      { sections },
      { ...formData },
      errors,
      touched
    );
    setErrors(result.errors);
    setTouched(result.touched);
    if (!result.valid) return;       // prevent navigation if step is invalid

    const cleaned = cleanupHiddenFields({ sections }, formData);
    setFormData(cleaned);
    onDataChange && onDataChange(cleaned);
    onBackToReview && onBackToReview(cleaned);
  };

  const handleSaveDraftClick = () => {
    onSaveDraft && onSaveDraft(formData);
  };

  return (
    <div className="jules-step">
      <div className="jules-step-header">
        <h2>{title}</h2> {/* h2 will be styled by jules_base.css */}
        {onBackToReview && (
          <button
            type="button"
            className="jules-button jules-button-tertiary jules-button-small jules-step-back-to-review"
            onClick={handleBackToReviewClick}
          >
            Back to Review step
          </button>
        )}
      </div>
      {sections.map((sec) => {
        const collapsed = collapsedSections[sec.id] || false;
        const visible = isSectionVisible(sec);
        if (!visible) {
          return null;
        }
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
            visible={visible}
          >
            {sec.content && <ReactMarkdown>{sec.content}</ReactMarkdown>}
            {sec.description && (
              // Assuming jules_section.css or jules_base.css might style .jules-section-description
              // Or if it's more like an input hint, jules-input-hint might be appropriate.
              // Let's use jules-section-description for now.
              <div className="jules-section-description">
                <ReactMarkdown>{sec.description}</ReactMarkdown>
              </div>
            )}
            {errors[sec.id] && (
              <div className="jules-alert jules-alert-error">{errors[sec.id]}</div>
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
                    {/* Assuming internal structure of form-group-wrapper etc. is handled by specific component styles or utility classes */}
                    <div className="form-subgroup-grid grid gap-4"> {/* This grid class is from Tailwind, might need Jules equivalent or custom flex */}
                      {groupFields.map((field) => renderField(field))}
                    </div>
                  </div>
                ));
                return entries.length > 1 ? (
                  // This group-columns class is also likely Tailwind or custom.
                  <div className="group-columns">{groups}</div>
                ) : (
                  groups
                );
              })()
            )}
          </Section>
        );
      })}
      <div className="jules-step-navigation">
        {!isFirst && (
          <button type="button" className="jules-button jules-button-secondary" onClick={handleBackClick}>
            Back
          </button>
        )}
        <button type="button" className="jules-button jules-button-secondary" onClick={handleSaveDraftClick}>
          Save Draft
        </button>
        {!isLast && (
          <button type="button" className="jules-button jules-button-primary" onClick={handleNextClick}>
            Next
          </button>
        )}
        {isLast && <button type="button" className="jules-button jules-button-primary">Submit</button>}
      </div>
    </div>
  );
}
