import React from 'react';
import FormRenderer from '../components/core/FormRenderer/FormRenderer';

export default function FormPage({ applicationId, onExit }) {
  return <FormRenderer applicationId={applicationId} onExit={onExit} />;
}
