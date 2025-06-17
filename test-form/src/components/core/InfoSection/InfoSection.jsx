import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './InfoSection.module.css';

export default function InfoSection({ title, content, ui = {}, collapsed = false, onToggle }) {
  const isCollapsible = ui.collapsible;

  // Convert escaped newline sequences to actual line breaks for ReactMarkdown
  const formattedContent = content
    ?.replace(/\\n/g, '\n')    // Unescape newline
    .replace(/\\"/g, '"');     // Unescape quotes, if present


  const headerClass = isCollapsible
    ? `${styles.header} ${styles.headerClickable}`
    : styles.header;

  return (
    <div className={styles.infoSection}>
      <div className={headerClass} onClick={isCollapsible ? onToggle : undefined}>
        <strong>{title}</strong> {isCollapsible && (collapsed ? '    ▶' : '    ▼')}
      </div>
      {(!isCollapsible || !collapsed) && formattedContent && (
        <div className={styles.content}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{formattedContent}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
