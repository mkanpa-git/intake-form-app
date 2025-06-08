import React from 'react';

export default function ApplicationCard({ id, serviceName, interactionName, savedAt, onContinue }) {
  const formatted = savedAt ? new Date(savedAt).toLocaleString() : '';
  return (
    <div className="card app-card">
      <h3 className="card-title">{serviceName}</h3>
      <p className="interaction-name">{interactionName}</p>
      <p className="app-id">ID: {id}</p>
      {formatted && <p className="saved-date">Saved: {formatted}</p>}
      <button onClick={() => onContinue(id)}>Continue</button>
    </div>
  );
}
