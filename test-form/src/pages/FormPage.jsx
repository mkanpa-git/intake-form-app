import React from 'react';
import FormRenderer from '../components/core/FormRenderer/FormRenderer';
import DycdFormRenderer from '../components/core/FormRenderer/DycdFormRenderer';
export default function FormPage({ applicationId, service = 'childcare', onExit }) {
  if (service === 'dycd') {
    return <DycdFormRenderer applicationId={applicationId} onExit={onExit} />;
  }
  return <FormRenderer applicationId={applicationId} onExit={onExit} />;
}
