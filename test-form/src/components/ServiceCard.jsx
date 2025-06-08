import React from 'react';

export default function ServiceCard({ name, interaction, description, onStart }) {
  return (
    <div className="card service-card">
      <h2 className="card-title">{name}</h2>
      <p className="interaction-name">{interaction}</p>
      <p className="description">{description}</p>
      <button onClick={onStart}>Start Application</button>
    </div>
  );
}
