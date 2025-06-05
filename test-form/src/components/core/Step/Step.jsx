import React, { useState } from 'react';
import { validateStep } from '../../../utils/formHelpers';
import Section from '../Section/Section';
import InfoSection from '../InfoSection/InfoSection';
import TextInput from '../../shared/TextInput/TextInput';
import SelectField from '../../shared/SelectField/SelectField';
import RadioGroup from '../../shared/RadioGroup/RadioGroup';
import GroupField from '../../shared/GroupField/GroupField';
import TableLayout from '../../shared/TableLayout/TableLayout';
import MaskedInput from '../../shared/MaskedInput/MaskedInput';
import FileInput from '../../shared/FileInput/FileInput';
import ReactMarkdown from 'react-markdown';
import styles from './Step.module.css';

export default function Step({
  title,
  sections = [],
  onNext,
  onBack,
  isFirst = false,
  isLast = false,
}) {
  const [collapsedSections, setCollapsedSections] = useState({});
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleToggle = (id) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const renderField = (field) => {
    const error = errors[field.id];
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'time':
        return (
          <>
            <TextInput
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              required={field.required}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
            {error && <div className="form-error-alert">{error}</div>}
          </>
        );
      case 'tel':
        return (
          <MaskedInput
            key={field.id}
            id={field.id}
            label={field.label}
            mask="(000) 000-0000"
            placeholder={field.ui?.placeholder || '(123) 456-7890'}
            required={field.required}
            value={formData[field.id] || ''}
            onChange={(val) => handleChange(field.id, val)}
            error={error}
          />
        );
      case 'select':
        return (
          <>
            <SelectField
              key={field.id}
              id={field.id}
              label={field.label}
              options={field.ui?.options || []}
              required={field.required}
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
              required={field.required}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
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
              required={field.required}
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
            required={field.required}
            onChange={(val) => handleChange(field.id, val)}
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
          />
        );
      default:
        return (
          <>
            <TextInput
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              required={field.required}
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
    return section.fields.some(
      (f) => f.required && !formData[f.id]
    );
  };

  const handleNextClick = () => {
    const result = validateStep(
      { sections },
      { ...formData },
      [],
      errors
    );
    setErrors(result.errors);
    if (!result.valid) return;
    onNext && onNext();
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
              sec.fields && sec.fields.map((field) => renderField(field))
            )}
          </Section>
        );
      })}
      <div className={styles.navigation}>
        {!isFirst && (
          <button type="button" onClick={onBack}>
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
