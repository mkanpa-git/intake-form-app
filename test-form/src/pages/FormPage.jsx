import React, { useEffect, useState } from 'react';
import FormRenderer from '../components/core/FormRenderer/FormRenderer';
import { useLanguage } from '../context/LanguageContext';
import loadMergedFormSpec from '../utils/loadFormSpec';
export default function FormPage({ applicationId, service = 'childcare', onExit }) {
  const { language } = useLanguage();
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    loadMergedFormSpec(service === 'DOHMH' ? 'group_cc_permit' : service, language)
      .then(setSpec)
      .catch((e) => {
        console.error('Failed to load form spec', e);
      });
  }, [service, language]);

  if (!spec) return <div>Loading form definition...</div>;

  return (
    <FormRenderer applicationId={applicationId} onExit={onExit} formSpec={spec} />
  );
}
