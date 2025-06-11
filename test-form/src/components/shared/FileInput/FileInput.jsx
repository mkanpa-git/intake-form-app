import React, { useState, useRef } from 'react';
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
  const [fileNames, setFileNames] = useState([]);
  const inputRef = useRef(null);

  const processFiles = async (files) => {
    if (!onChange || files.length === 0) return;
    if (files.length > 0) {
      setFileNames(files.map((f) => f.name));
    }

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
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    if (inputRef.current) {
      inputRef.current.files = dt.files;
    }
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
    <div className={styles.container}>
      {label && <label htmlFor={id}>{label}</label>}
      {description && (
        <div className={styles.description}>
          <ReactMarkdown>{description}</ReactMarkdown>
        </div>
      )}
      <div
        className={`${styles.field}${dragOver ? ' ' + styles.dragOver : ''}`}
        onDragEnter={handleDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={styles.dropHint} style={{ display: dragOver ? 'none' : 'block' }}>
          Drop files here
        </div>
        {fileNames.length > 0 && (
          <ul className={styles.fileList}>
            {fileNames.map((name) => (
              <li key={name} className={styles.fileName}>{name}</li>
            ))}
          </ul>
        )}
        <input
          ref={inputRef}
          id={id}
          type="file"
          multiple={multiple}
          onChange={handleFileChange}
          className={`${styles.input}${error ? ' error' : ''}`}
          {...props}
        />
      </div>
      {hint && (
        <div className="form-hint text-sm text-gray-500 italic mt-1">{hint}</div>
      )}
      {error && <div className="form-error-alert">{error}</div>}
    </div>
  );
}
