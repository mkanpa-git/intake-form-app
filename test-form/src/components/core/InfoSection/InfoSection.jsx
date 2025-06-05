import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function InfoSection({ title, content, ui = {}, collapsed = false, onToggle }) {
  const isCollapsible = ui.collapsible;

  return (
    <div className="info-section">
      <div
        className="info-section-header"
        onClick={isCollapsible ? onToggle : undefined}
        style={{
          cursor: isCollapsible ? 'pointer' : 'default',
          fontWeight: 'bold',
          backgroundColor: '#f0f0f0',
          padding: '0.5rem',
          borderRadius: '4px',
        }}
      >
        {title} {isCollapsible && (collapsed ? '▶' : '▼')}
      </div>
      {(!isCollapsible || !collapsed) && content && (
        <div
          className="info-section-content"
          style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}
        >
          {ui.markdown ? (
            <ReactMarkdown>{content}</ReactMarkdown>
          ) : (
            content.split('\n').map((line, idx) => <p key={idx}>{line}</p>)
          )}
        </div>
      )}
    </div>
  );
}
