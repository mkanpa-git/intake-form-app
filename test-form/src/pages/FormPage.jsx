import React from 'react';
import FormRenderer from '../components/core/FormRenderer/FormRenderer';

export default function FormPage({ applicationId, service = 'childcare', onExit }) {
  const path = service === 'dycd' ? '/data/dycd_form.json' : '/data/childcare_form.json';
  return (
    <FormRenderer
      applicationId={applicationId}
      onExit={onExit}
      formSpecPath={path}
    />
  );
}
