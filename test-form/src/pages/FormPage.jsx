import React from 'react';
import FormRenderer from '../components/core/FormRenderer/FormRenderer';
import { useLanguage } from '../context/LanguageContext';
export default function FormPage({ applicationId, service = 'childcare', onExit }) {
  const { language } = useLanguage();
  let path = `/data/childcare_form.${language}.json`;
  if (service === 'dycd') {
    path = `/data/dycd_form.${language}.json`;
  } else if (service === 'DOHMH') {
    path = `/data/group_cc_permit.${language}.json`;
  }
  return (
    <FormRenderer
      applicationId={applicationId}
      onExit={onExit}
      formSpecPath={path}
    />
  );
}
