import React from 'react';

export default function ApplicationCard({
  id,
  serviceName,
  interactionName,
  savedAt,
  onContinue,
  onDelete,
}) {
  const formatted = savedAt ? new Date(savedAt).toLocaleString() : '';
  return (
    <div className="app-card">
      <h3 className="card-title">{serviceName}</h3>
      <p className="interaction-name">{interactionName}</p>
      <p className="app-id">ID: {id}</p>
      {formatted && <p className="saved-date">Saved: {formatted}</p>}
      <div className="app-card-actions">
        <button
          onClick={() => {
            onContinue && onContinue(id);
          }}
        >
          Continue
        </button>
        <button
          onClick={() => {
            onDelete && onDelete(id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
