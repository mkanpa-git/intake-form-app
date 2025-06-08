import React from 'react';

export default function ServiceCard({ name, interaction, description, onStart }) {
  return (
    <a
      href="#"
      className="service-card"
      onClick={(e) => {
        e.preventDefault();
        onStart && onStart();
      }}
    >
      <h2 className="card-title">{name}</h2>
      <p className="interaction-name">{interaction}</p>
      <p className="description">{description}</p>
    </a>
  );
}
