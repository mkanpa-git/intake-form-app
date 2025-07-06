import React, { useState, useEffect, useContext } from 'react';
import { loadApplications, upsertApplication, deleteApplication } from '../utils/appStorage';
import { AuthContext } from '../context/AuthContext';
import ServiceCard from '../components/ServiceCard';
import ApplicationCard from '../components/ApplicationCard';

const SERVICE_INFO = {
  childcare: {
    name: 'Child Care Assistance',
    interaction: 'Child Care Assistance Application',
  },
  dycd: {
    name: 'DYCD Youth Services Intake – Ages 13 and Younger',
    interaction: 'Youth Services Intake',
  },
  DOHMH: {
    name: 'Group Child Care Permit',
    interaction: 'Group Child Care Permit Application',
  },
};

export default function Dashboard({ onStart }) {
  const { user } = useContext(AuthContext);
  const [apps, setApps] = useState([]);

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
        <ServiceCard
          name="Group Child Care Permit"
          interaction="Group Child Care Permit Application"
          description="Application for Group Child Care Permit"
          onStart={() => createNew('DOHMH')}
        />
      </div>

      {user && apps.length > 0 && (
        <div className="jules-draft-list">
          {/* h2 will be styled by jules_base.css */}
          <h2>Saved Applications</h2>
          <div className="jules-grid-container jules-saved-applications-grid">
            {apps.map((app) => {
              const key = app.serviceKey || app.service_key || 'childcare';
              const info = SERVICE_INFO[key] || SERVICE_INFO.childcare;
              const savedAt = app.updatedAt || app.updated_at;
              return (
                <ApplicationCard
                  key={app.id}
                  id={app.id}
                  serviceName={info.name}
                  interactionName={info.interaction}
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
