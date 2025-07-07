import React, { useState, useEffect } from 'react';
import {
  validateStep,
  validateField,
  evaluateCondition,
  cleanupHiddenFields,
} from '../../../utils/formHelpers';
import Section from '../Section/Section';
import InfoSection from '../InfoSection/InfoSection';
import TableLayout from '../../shared/TableLayout/TableLayout';
import GroupField from '../../shared/GroupField/GroupField';
import {
  TextField,
  SelectFieldWrapper,
  RadioField,
  CheckboxField,
  DateField,
  FileField,
  TelField,
  SsnField,
  AddressField,
  GroupFieldWrapper,
} from '../../shared/fields';
import ReactMarkdown from 'react-markdown';
import Button from '../../shared/Button/Button'; // Import the new Button component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faFloppyDisk,
  faReply,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
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
  onValidationFail,
}) {
  const [collapsedSections, setCollapsedSections] = useState({});
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [placeholders, setPlaceholders] = useState({});
  const [isSavingDraft, setIsSavingDraft] = useState(false); // New state for save draft loading

  const sectionHasValidationErrors = (sectionId, currentErrors) => {
    if (!sections || !currentErrors || Object.keys(currentErrors).length === 0) {
        return false;
    }
    // Find the section by ID from the sections prop (which contains the definition)
    const sectionDefinition = sections.find(s => s.id === sectionId);
    if (!sectionDefinition || !Array.isArray(sectionDefinition.fields)) {
        return false;
    }
    // Check if any field within that section has an error in currentErrors
    return sectionDefinition.fields.some(field => currentErrors[field.id]);
  };

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

  // Reset form errors and touched state when initialData or sections change
  useEffect(() => {
    setErrors({});
    setTouched({});
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

  const FIELD_COMPONENTS = {
    text: TextField,
    email: TextField,
    number: TextField,
    time: TextField,
    select: SelectFieldWrapper,
    radio: RadioField,
    checkbox: CheckboxField,
    date: DateField,
    file: FileField,
    group: GroupFieldWrapper,
    tel: TelField,
    ssn: SsnField,
    address: AddressField,
  };

  const getFieldKey = (field) => {
    if (
      field.type === 'tel' ||
      field.id.includes('telephone') ||
      (typeof field.label === 'string' && field.label.toLowerCase().includes('phone'))
    ) {
      return 'tel';
    }
    if (
      field.id === 'ssn' ||
      (typeof field.label === 'string' && field.label.toLowerCase().includes('social security'))
    ) {
      return 'ssn';
    }
    if (
      field.id === 'street' ||
      (typeof field.label === 'string' && field.label.toLowerCase().includes('street address'))
    ) {
      return 'address';
    }
    return field.type;
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
    const fieldKey = getFieldKey(field);
    const Component = FIELD_COMPONENTS[fieldKey] || TextField;

    const commonProps = {
      field: { ...field, required: isRequired },
      value: formData[field.id],
      error,
      touched: touched[field.id],
    };

    const handleValueChange = (val) => handleChange(field.id, val);

    switch (fieldKey) {
      case 'select':
        return (
          <Component
            {...commonProps}
            onChange={(e) => {
              if (field.metadata?.multiple) {
                handleValueChange(Array.from(e.target.selectedOptions).map((o) => o.value));
              } else {
                handleValueChange(e.target.value);
              }
            }}
          />
        );
      case 'radio':
        return <Component {...commonProps} onChange={(e) => handleValueChange(e.target.value)} />;
      case 'checkbox':
        return <Component {...commonProps} onChange={handleValueChange} />;
      case 'group':
        return <Component {...commonProps} onChange={handleValueChange} fullData={fullData} />;
      case 'file':
        return (
          <Component
            {...commonProps}
            onChange={handleValueChange}
            applicationId={applicationId}
          />
        );
      case 'address':
        return (
          <Component
            {...commonProps}
            onChange={handleValueChange}
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
              handleValueChange(streetOnly);
            }}
            placeholder={placeholders[field.id]}
          />
        );
      default:
        return (
          <Component
            {...commonProps}
            onChange={(val) =>
              handleValueChange(val && val.target ? val.target.value : val)
            }
          />
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
      touched,
      fullData
    );
    setErrors(result.errors);
    setTouched(result.touched);
    if (!result.valid) {
      const summary = Object.entries(result.errors)
        .filter(([, msg]) => msg)
        .map(([id, msg]) => ({ id, msg }));
      onValidationFail?.(summary);
      return;
    }
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
      touched,
      fullData
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
      touched,
      fullData
    );
    setErrors(result.errors);
    setTouched(result.touched);
    if (!result.valid) {
      const summary = Object.entries(result.errors)
        .filter(([, msg]) => msg)
        .map(([id, msg]) => ({ id, msg }));
      onValidationFail?.(summary);
      return;       // prevent navigation if step is invalid
    }

    const cleaned = cleanupHiddenFields({ sections }, formData);
    setFormData(cleaned);
    onDataChange && onDataChange(cleaned);
    onBackToReview && onBackToReview(cleaned);
  };

  const handleSaveDraftClick = async () => {
    setIsSavingDraft(true);
    try {
      await onSaveDraft?.(formData);
    } finally {
      setIsSavingDraft(false);
    }
  };

  return (
    <div className="jules-step">
      <div className="jules-step-header">
        <h2>{title}</h2> {/* h2 will be styled by jules_base.css */}
        {onBackToReview && (
          <Button
            variant="tertiary"
            size="small"
            className="jules-step-back-to-review"
            onClick={handleBackToReviewClick}
            iconLeft={<FontAwesomeIcon icon={faReply} aria-hidden="true" />}
          >
            Back to Review step
          </Button>
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
            // showAlert={sectionHasMissing(sec) && isCollapsed} // Old prop
            showAlertIcon={sectionHasMissing(sec)} // New prop for missing required
            showErrorIcon={sectionHasValidationErrors(sec.id, errors)} // New prop for validation errors
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
          <Button
            variant="secondary"
            onClick={handleBackClick}
            iconLeft={<FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />}
          >
            Back
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={handleSaveDraftClick}
          iconLeft={<FontAwesomeIcon icon={faFloppyDisk} aria-hidden="true" />}
          isLoading={isSavingDraft}
        >
          Save Draft
        </Button>
        {!isLast && (
          <Button
            variant="primary"
            onClick={handleNextClick}
            iconRight={<FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />}
          >
            Next
          </Button>
        )}
        {/* Assuming onNext handles final submission if isLast is true, or a dedicated submit handler would be passed. */}
        {isLast && (
          <Button
            variant="primary"
            onClick={handleNextClick}
            iconRight={<FontAwesomeIcon icon={faCheck} aria-hidden="true" />}
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
}
