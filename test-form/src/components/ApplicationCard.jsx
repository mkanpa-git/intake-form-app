import React from 'react';
import Button from './shared/Button/Button'; // Import the new Button component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function ApplicationCard({
  id,
  serviceName,
  interactionName,
  savedAt,
  onContinue,
  onDelete,
}) {
  const formatted = savedAt ? new Date(savedAt).toLocaleString() : '';

  // Make the whole card clickable if onContinue is primary action
  const handleCardClick = (e) => {
    // Prevent click action if a button inside the card was clicked
    if (e.target.closest('button')) {
      return;
    }
    onContinue && onContinue(id);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleCardClick(e);
    }
  };

  return (
    <div
      className="jules-card jules-application-card"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button" // Make it behave like a button for accessibility
      tabIndex={0}   // Make it focusable
    >
      <div className="jules-card-header">
        <div className="jules-card-avatar-icon-placeholder">
            <span>{serviceName ? serviceName.charAt(0).toUpperCase() : 'A'}</span> {/* Use first letter of serviceName */}
        </div>
        <div>
            <h3 className="jules-card-title">{serviceName || 'Application'}</h3>
            {interactionName && <p className="jules-card-interaction-name">{interactionName}</p>}
        </div>
      </div>
      {/* Rest of the card content */}
      <p className="jules-card-app-id">ID: {id}</p>
      {formatted && <p className="jules-card-saved-date">Saved: {formatted}</p>}

      <div className="jules-card-actions">
        <Button
          variant="primary" // Continue button might be primary in this context
          size="small"
          onClick={() => onContinue && onContinue(id)}
          iconRight={<FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />}
        >
          Continue
        </Button>
        <Button
          variant="secondary"
          size="small"
          onClick={() => onDelete && onDelete(id)}
          iconLeft={<FontAwesomeIcon icon={faTrash} aria-hidden="true" />}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
