import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function InfoSection({ title, content, ui = {}, collapsed = false, onToggle }) {
  const isCollapsible = ui.collapsible;

  // Convert escaped newline sequences to actual line breaks for ReactMarkdown
  const formattedContent = content?.replace(/\\n/g, '\n');

  return (
    <div className="info-section">
      <div
        className="info-section-header"
        onClick={isCollapsible ? onToggle : undefined}
        style={{
          cursor: isCollapsible ? 'pointer' : 'default',
          backgroundColor: '#f0f0f0',
          padding: '0.5rem',
          borderRadius: '4px',
        }}
      >
        <strong>{title}</strong> {isCollapsible && (collapsed ? '▶' : '▼')}
      </div>
      {(!isCollapsible || !collapsed) && formattedContent && (
        <div
          className="info-section-content"
          style={{ marginTop: '0.5rem', paddingLeft: '1rem', fontWeight: 'normal' }}
        >
          <ReactMarkdown>{formattedContent}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
