import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './FileInput.module.css';

export default function FileInput({
  id,
  label,
  description,
  multiple = false,
  error,
  hint,
  applicationId,
  onChange,
  ...props
}) {
  const [dragOver, setDragOver] = useState(false);

  const processFiles = async (files) => {
    if (!onChange || files.length === 0) return;

    if (applicationId) {
      const form = new FormData();
      files.forEach((f) => form.append('files', f));
      try {
        const res = await fetch(`/api/applications/${applicationId}/upload`, {
          method: 'POST',
          body: form,
        });
        const data = await res.json();
        if (res.ok) {
          const value = multiple ? data.paths : data.paths[0];
          onChange(value);
          return;
        }
        console.error('Upload failed', data);
      } catch (err) {
        console.error('Upload error', err);
      }
    }

    onChange(multiple ? files : files[0]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    processFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragOver) setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  return (
    <div
      className={`${styles.field}${dragOver ? ' ' + styles.dragOver : ''}`}
      onDragEnter={handleDragOver}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {label && <label htmlFor={id}>{label}</label>}
      {description && (
        <div className={styles.description}>
          <ReactMarkdown>{description}</ReactMarkdown>
        </div>
      )}
      <input
        id={id}
        type="file"
        multiple={multiple}
        onChange={handleFileChange}
        className={`${styles.input}${error ? ' error' : ''}`}
        {...props}
      />
      {hint && (
        <div className="form-hint text-sm text-gray-500 italic mt-1">{hint}</div>
      )}
      {error && <div className="form-error-alert">{error}</div>}
    </div>
  );
}
