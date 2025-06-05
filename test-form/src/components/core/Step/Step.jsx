import React from 'react';
import Section from '../Section/Section';
import TextInput from '../../shared/TextInput/TextInput';
import SelectField from '../../shared/SelectField/SelectField';
import RadioGroup from '../../shared/RadioGroup/RadioGroup';
import ReactMarkdown from 'react-markdown';
import styles from './Step.module.css';

export default function Step({ title, sections = [] }) {
  return (
    <div className={styles.step}>
      <h2>{title}</h2>
      {sections.map(sec => (
        <Section key={sec.id} title={sec.title}>
          {sec.content && <ReactMarkdown>{sec.content}</ReactMarkdown>}
          {sec.fields && sec.fields.map(field => {
            switch (field.type) {
              case 'text':
                return (
                  <TextInput
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    required={field.required}
                  />
                );
              case 'select':
                return (
                  <SelectField
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    options={field.ui?.options || []}
                    required={field.required}
                  />
                );
              case 'radio':
                return (
                  <RadioGroup
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    options={field.ui?.options || []}
                    required={field.required}
                  />
                );
              case 'date':
                return (
                  <TextInput
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    type="date"
                    required={field.required}
                  />
                );
              default:
                return null;
            }
          })}
        </Section>
      ))}
    </div>
  );
}
