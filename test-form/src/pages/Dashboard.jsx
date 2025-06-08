import React, { useState, useEffect } from 'react';
import { loadApplications, saveApplications } from '../utils/appStorage';
import ServiceCard from '../components/ServiceCard';
import ApplicationCard from '../components/ApplicationCard';

export default function Dashboard({ onStart }) {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    setApps(loadApplications());
  }, []);

  const handleNew = () => {
    const id = Date.now().toString();
    const newApp = {
      id,
      stepData: {},
      allData: {},
      currentStep: 0,
      serviceName: 'Child Care Assistance',
      interactionName: 'Child Care Assistance Application',
      updatedAt: new Date().toISOString(),
    };
    const updated = [...apps, newApp];
    saveApplications(updated);
    setApps(updated);
    onStart && onStart(id);
  };

  const handleContinue = (id) => {
    onStart && onStart(id);
  };

  return (
    <div className="dashboard-page">
      <h1>Service Catalog</h1>
      <div className="catalog-grid">
        <ServiceCard
          name="Child Care Assistance"
          interaction="Child Care Assistance Application"
          description="Step-by-step form for applying for Childcare Assistance"
          onStart={handleNew}
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
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
