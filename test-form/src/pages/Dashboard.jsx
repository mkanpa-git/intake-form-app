import React, { useState, useEffect } from 'react';
import { loadApplications, saveApplications } from '../utils/appStorage';

export default function Dashboard({ onStart }) {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    setApps(loadApplications());
  }, []);

  const handleNew = () => {
    const id = Date.now().toString();
    const newApp = { id, stepData: {}, allData: {}, currentStep: 0 };
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
      <button onClick={handleNew}>Start Child Care Assistance Application</button>

      {apps.length > 0 && (
        <div className="draft-list">
          <h2>Saved Applications</h2>
          <ul>
            {apps.map((app) => (
              <li key={app.id}>
                Application {app.id}
                <button onClick={() => handleContinue(app.id)}>Continue</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
