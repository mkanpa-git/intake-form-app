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
      {/* h2 and p tags will be styled by jules_base.css. Specific card content classes can be added if needed. */}
      <h2 className="jules-card-title">{name}</h2>
      <p className="jules-card-interaction-name">{interaction}</p>
      <p className="jules-card-description">{description}</p>
      {/* Could add a "Start" button/link look if desired, but original is full clickable card */}
      <span className="jules-card-action-link">Start Application &rarr;</span>
    </a>
  );
}
