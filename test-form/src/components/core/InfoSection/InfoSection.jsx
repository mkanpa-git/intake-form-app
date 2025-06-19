import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// import styles from './InfoSection.module.css'; // Removed CSS Module import

export default function InfoSection({ title, content, ui = {}, collapsed = false, onToggle }) {
  const isCollapsible = ui.collapsible;
  const defaultCollapsed = ui.defaultCollapsed || false; // Ensure defaultCollapsed is respected if 'collapsed' prop is not explicitly passed

  // Use 'collapsed' prop if provided, otherwise use 'defaultCollapsed' from ui schema
  const isCurrentlyCollapsed = typeof collapsed === 'boolean' ? collapsed : defaultCollapsed;


  // Convert escaped newline sequences to actual line breaks for ReactMarkdown
  const formattedContent = content
    ?.replace(/\\n/g, '\n')    // Unescape newline
    .replace(/\\"/g, '"');     // Unescape quotes, if present

  const rootClasses = `jules-section jules-info-section ${isCurrentlyCollapsed && isCollapsible ? 'jules-section-collapsed-initial' : ''}`; // Add initial collapsed class if needed

  const headerClasses = `jules-section-header ${isCollapsible ? 'jules-section-collapsible' : ''} ${isCurrentlyCollapsed && isCollapsible ? 'jules-section-collapsed' : ''}`;

  const contentClasses = `jules-section-content ${isCurrentlyCollapsed && isCollapsible ? 'jules-section-content-collapsed' : ''}`;

  return (
    <div className={rootClasses}>
      <div
        className={headerClasses}
        onClick={isCollapsible ? onToggle : undefined}
        role={isCollapsible ? "button" : undefined}
        aria-expanded={isCollapsible ? !isCurrentlyCollapsed : undefined}
        tabIndex={isCollapsible ? 0 : undefined}
        onKeyDown={isCollapsible ? (e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(); } : undefined}
      >
        <strong className="jules-section-title">{title}</strong> {/* Added class for consistency */}
        {isCollapsible && (
          <span className="jules-section-toggle-icon">
            {isCurrentlyCollapsed ? '▶' : '▼'}
          </span>
        )}
      </div>
      {/* Conditionally render content div itself based on collapsed state, or rely on CSS to hide it */}
      {/* The CSS handles display:none for .jules-section-content-collapsed */}
      <div className={contentClasses}>
        {formattedContent && <ReactMarkdown remarkPlugins={[remarkGfm]}>{formattedContent}</ReactMarkdown>}
      </div>
    </div>
  );
}
