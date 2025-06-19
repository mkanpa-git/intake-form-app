import React from 'react';
import Button from '../shared/Button/Button'; // Import the new Button component

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
    <div className="jules-card jules-application-card">
      {/* h3 and p tags will be styled by jules_base.css. Specific card content classes can be added if needed. */}
      <h3 className="jules-card-title">{serviceName}</h3>
      <p className="jules-card-interaction-name">{interactionName}</p>
      <p className="jules-card-app-id">ID: {id}</p>
      {formatted && <p className="jules-card-saved-date">Saved: {formatted}</p>}
      <div className="jules-card-actions">
        <Button
          variant="primary"
          size="small"
          onClick={() => onContinue && onContinue(id)}
          iconRight="→"
        >
          Continue
        </Button>
        <Button
          variant="destructive"
          size="small"
          onClick={() => onDelete && onDelete(id)}
          iconLeft="🗑"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
