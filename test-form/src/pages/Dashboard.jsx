import React, { useState, useEffect } from 'react';
import { loadApplications, saveApplications, deleteApplication } from '../utils/appStorage';
import ServiceCard from '../components/ServiceCard';
import ApplicationCard from '../components/ApplicationCard';

export default function Dashboard({ onStart }) {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    setApps(loadApplications());
  }, []);

  const createNew = (serviceKey) => {
    const id = Date.now().toString();
    const isDycd = serviceKey === 'dycd';
    const newApp = {
      id,
      serviceKey,
      stepData: {},
      allData: {},
      currentStep: 0,
      serviceName: isDycd
        ? 'DYCD Youth Services Intake – Ages 13 and Younger'
        : 'Child Care Assistance',
      interactionName: isDycd
        ? 'Youth Services Intake'
        : 'Child Care Assistance Application',
      updatedAt: new Date().toISOString(),
    };
    const updated = [...apps, newApp];
    saveApplications(updated);
    setApps(updated);
    onStart && onStart(serviceKey, id);
  };

  const handleContinue = (id) => {
    const app = apps.find((a) => a.id === id);
    const key = app?.serviceKey || 'childcare';
    onStart && onStart(key, id);
  };

  const handleDelete = (id) => {
    deleteApplication(id);
    setApps((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="dashboard-page">
      <h1>Service Catalog</h1>
      <div className="catalog-grid">
        <ServiceCard
          name="Child Care Assistance"
          interaction="Child Care Assistance Application"
          description="Step-by-step form for applying for Childcare Assistance"
          onStart={() => createNew('childcare')}
        />
        <ServiceCard
          name="DYCD Youth Services Intake – Ages 13 and Younger"
          interaction="Youth Services Intake"
          description="Form to collect youth and guardian information for DYCD programs"
          onStart={() => createNew('dycd')}
        />
      </div>

      {apps.length > 0 && (
        <div className="draft-list">
          <h2>Saved Applications</h2>
          <div className="saved-grid">
            {apps.map((app) => (
              <ApplicationCard
                key={app.id}
                id={app.id}
                serviceName={app.serviceName || 'Child Care Assistance'}
                interactionName={app.interactionName || 'Child Care Assistance Application'}
                savedAt={app.updatedAt}
                onContinue={handleContinue}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
