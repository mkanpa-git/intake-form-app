import React, { useState, useEffect, useContext } from 'react';
import { loadApplications, upsertApplication, deleteApplication } from '../utils/appStorage';
import { AuthContext } from '../context/AuthContext';
import ServiceCard from '../components/ServiceCard';
import ApplicationCard from '../components/ApplicationCard';
import { useTranslation } from 'react-i18next';

const SERVICE_INFO = {
  childcare: {
    nameKey: 'serviceChildcareName',
    interactionKey: 'serviceChildcareInteraction',
    descriptionKey: 'serviceChildcareDescription',
  },
  dycd: {
    nameKey: 'serviceDycdName',
    interactionKey: 'serviceDycdInteraction',
    descriptionKey: 'serviceDycdDescription',
  },
  DOHMH: {
    nameKey: 'serviceDohmhName',
    interactionKey: 'serviceDohmhInteraction',
    descriptionKey: 'serviceDohmhDescription',
  },
};

export default function Dashboard({ onStart }) {
  const { user } = useContext(AuthContext);
  const [apps, setApps] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      loadApplications().then(setApps);
    } else {
      setApps([]);
    }
  }, [user]);

  const createNew = async (serviceKey) => {
    const id = crypto.randomUUID();
    await upsertApplication(id, {
      serviceKey,
      stepData: {},
      allData: {},
      currentStep: 0,
      status: 'draft',
    });
    const updated = await loadApplications();
    setApps(updated);
    onStart && onStart(serviceKey, id);
  };

  const handleContinue = (id) => {
    const app = apps.find((a) => a.id === id);
    const key = app?.serviceKey || app?.service_key || 'childcare';
    onStart && onStart(key, id);
  };

  const handleDelete = async (id) => {
    await deleteApplication(id);
    setApps((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    // Assuming .jules-page-container or similar might be defined in jules_layout.css for page-level padding/margins
    // For now, let's use a more specific class that can be styled.
    <div className="jules-dashboard-page">
      {/* h1 will be styled by jules_base.css */}
      <h1>{t('serviceCatalog')}</h1>
      {/* A generic grid class, could be styled with CSS Grid or Flexbox in jules_layout.css or jules_misc.css */}
      <div className="jules-grid-container jules-service-catalog-grid">
        <ServiceCard
          name={t('serviceChildcareName')}
          interaction={t('serviceChildcareInteraction')}
          description={t('serviceChildcareDescription')}
          onStart={() => createNew('childcare')}
        />
        <ServiceCard
          name={t('serviceDycdName')}
          interaction={t('serviceDycdInteraction')}
          description={t('serviceDycdDescription')}
          onStart={() => createNew('dycd')}
        />
        <ServiceCard
          name={t('serviceDohmhName')}
          interaction={t('serviceDohmhInteraction')}
          description={t('serviceDohmhDescription')}
          onStart={() => createNew('DOHMH')}
        />
      </div>

      {user && apps.length > 0 && (
        <div className="jules-draft-list">
          {/* h2 will be styled by jules_base.css */}
          <h2>{t('savedApplications')}</h2>
          <div className="jules-grid-container jules-saved-applications-grid">
            {apps.map((app) => {
              const key = app.serviceKey || app.service_key || 'childcare';
              const info = SERVICE_INFO[key] || SERVICE_INFO.childcare;
              const savedAt = app.updatedAt || app.updated_at;
              return (
                <ApplicationCard
                  key={app.id}
                  id={app.id}
                  serviceName={t(info.nameKey)}
                  interactionName={t(info.interactionKey)}
                  savedAt={savedAt}
                  onContinue={handleContinue}
                  onDelete={handleDelete}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
