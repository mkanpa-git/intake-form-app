import React from 'react';

export default function ServiceCard({ name, interaction, description, onStart }) {
  return (
    <a
      href="#"
      className="jules-card jules-service-card" // Applied jules-card and specific service card class
      onClick={(e) => {
        e.preventDefault();
        onStart && onStart();
      }}
    >
      <div className="jules-card-header">
        <div className="jules-card-avatar-icon-placeholder">
            <span>{name ? name.charAt(0).toUpperCase() : 'S'}</span> {/* Use first letter of service name */}
        </div>
        <div>
            <h3 className="jules-card-title">{name}</h3> {/* Changed h2 to h3 for consistency with ApplicationCard title level */}
            {interaction && <p className="jules-card-interaction-name">{interaction}</p>}
        </div>
      </div>
      <p className="jules-card-description">{description}</p>
      <span className="jules-card-action-link">Start Application &rarr;</span>
    </a>
  );
}
