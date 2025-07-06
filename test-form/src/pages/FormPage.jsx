import React from 'react';
import FormRenderer from '../components/core/FormRenderer/FormRenderer';

export default function FormPage({ applicationId, service = 'childcare', onExit }) {
  let path = '/data/childcare_form.json';
  if (service === 'dycd') {
    path = '/data/dycd_form.json';
  } else if (service === 'DOHMH') {
    path = '/data/group_cc_permit.json';
  }
  return (
    <FormRenderer
      applicationId={applicationId}
      onExit={onExit}
      formSpecPath={path}
    />
  );
}
