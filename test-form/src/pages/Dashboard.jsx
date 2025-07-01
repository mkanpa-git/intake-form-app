import React, { useState, useEffect } from 'react';
import { loadApplications, upsertApplication, deleteApplication } from '../utils/appStorage';
import ServiceCard from '../components/ServiceCard';
import ApplicationCard from '../components/ApplicationCard';

export default function Dashboard({ onStart }) {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    loadApplications().then(setApps);
  }, []);

  const createNew = async (serviceKey) => {
    const id = crypto.randomUUID();
    const isDycd = serviceKey === 'dycd';
    await upsertApplication(id, {
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
      status: 'draft',
    });
    const updated = await loadApplications();
    setApps(updated);
    onStart && onStart(serviceKey, id);
  };

  const handleContinue = (id) => {
    const app = apps.find((a) => a.id === id);
    const key = app?.serviceKey || 'childcare';
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
      <h1>Service Catalog</h1>
      {/* A generic grid class, could be styled with CSS Grid or Flexbox in jules_layout.css or jules_misc.css */}
      <div className="jules-grid-container jules-service-catalog-grid">
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
        <div className="jules-draft-list">
          {/* h2 will be styled by jules_base.css */}
          <h2>Saved Applications</h2>
          <div className="jules-grid-container jules-saved-applications-grid">
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
