import React from 'react';
import Step from '../Step/Step';
import formSpec from '../../data/childcare_form.json';

export default function FormRenderer() {
  const { form } = formSpec;
  return (
    <div>
      <h1>{form.title}</h1>
      <p>{form.description}</p>
      {form.steps.map(step => (
        <Step key={step.id} title={step.title} sections={step.sections} />
      ))}
    </div>
  );
}
