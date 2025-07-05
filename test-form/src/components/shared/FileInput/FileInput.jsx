import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
// import styles from './FileInput.module.css'; // Removed CSS Module import - likely redundant
import Tooltip from '../Tooltip/Tooltip'; // Assuming Tooltip is already refactored
import { getCsrfToken } from '../../../utils/csrf';

export default function FileInput({
  id,
  label,
  tooltip,
  description,
  multiple = false,
  required, // Added required prop
  error,
  hint,
  applicationId,
  onChange,
  className,
  ...props
}) {
  const [dragOver, setDragOver] = useState(false);
  const [fileNames, setFileNames] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const dragCounter = useRef(0);
  const inputRef = useRef(null);

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  const processFiles = async (filesArray) => {
    if (!onChange || filesArray.length === 0) return;

    setFileNames(filesArray.map((f) => f.name));
    setUploadError('');

    if (applicationId) {
      const form = new FormData();
      filesArray.forEach((f) => form.append('files', f));
      try {
        const res = await fetch(`/api/applications/${applicationId}/upload`, {
          method: 'POST',
          headers: { 'X-CSRF-Token': getCsrfToken() },
          body: form,
        });
        const data = await res.json();
        if (res.ok) {
          const value = multiple ? data.paths : data.paths[0];
          onChange(value);
          return;
        }
        console.error('Upload failed', data);
        setUploadError(data.error || 'Upload failed');
      } catch (err) {
        console.error('Upload error', err);
        setUploadError('Upload failed');
      }
    } else {
      // If no applicationId, pass the FileList/File object directly
      onChange(multiple ? filesArray : filesArray[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    processFiles(files);
    // Assign to inputRef for consistency if needed, though processFiles already handles it
    if (inputRef.current) {
        const dataTransfer = new DataTransfer();
        files.forEach(file => dataTransfer.items.add(file));
        inputRef.current.files = dataTransfer.files;
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragOver(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setDragOver(false);
    }
  };

  const wrapperClasses = [
    'jules-form-field', // Changed from jules-input-group to jules-form-field
    'jules-file-input-wrapper',
    className || ''
  ].join(' ').trim();

  const dropzoneClasses = [
    'jules-file-dropzone',
    dragOver ? 'jules-dropzone-active' : '', // Class for active drag state
    error ? 'jules-input-error' : '' // Apply error styling to dropzone
  ].join(' ').trim();

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={id} className="jules-label"> {/* htmlFor should point to the actual file input for accessibility */}
          {label}
          {required && <span className="jules-required-asterisk">*</span>}
          {tooltip && <Tooltip text={tooltip} />}
        </label>
      )}
      {description && (
        <div className="jules-input-hint"> {/* Changed from styles.description */}
          <ReactMarkdown>{description}</ReactMarkdown>
        </div>
      )}
      <div
        className={dropzoneClasses}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput} // Make the dropzone clickable to open file dialog
        tabIndex={0} // Make it focusable
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') triggerFileInput(); }} // Keyboard accessible
      >
        {/* Hidden actual file input */}
        <input
          ref={inputRef}
          id={id}
          type="file"
          multiple={multiple}
          onChange={handleFileChange}
          className="jules-file-native-input" // Class to hide it visually but keep it accessible
          required={required}
          {...props}
        />
        {/* Visual content of the dropzone */}
        <span className="jules-file-dropzone-icon">📤</span> {/* Example icon */}
        <p className="jules-file-dropzone-text">
          Drag & drop {multiple ? 'files' : 'a file'} here, or click to select.
        </p>
        {/* Fallback "Choose File" button can be styled within or outside this div if needed */}
        {/* <button type="button" className="jules-button jules-button-secondary jules-file-choose-button" onClick={triggerFileInput}>Choose File(s)</button> */}

      </div>

      {fileNames.length > 0 && (
        <ul className="jules-file-list">
          {fileNames.map((name, index) => (
            <li key={`${name}-${index}`} className="jules-file-list-item">
              <span>{name}</span>
              {/* Basic remove button, functionality would require managing the files state */}
              {/* <button type="button" className="jules-file-remove-button">&times;</button> */}
            </li>
          ))}
        </ul>
      )}

      {hint && !error && (
        <p className="jules-input-hint">{hint}</p>
      )}
      {error && <div className="jules-alert jules-alert-error jules-input-error-message">{error}</div>}
      {uploadError && <div className="jules-alert jules-alert-error">{uploadError}</div>}
    </div>
  );
}
