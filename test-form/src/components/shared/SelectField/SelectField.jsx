import React from 'react';
import styles from './SelectField.module.css';
import Tooltip from '../Tooltip/Tooltip';

// SelectField renders a dropdown. When a `placeholder` prop is provided and the
// select is not in multiple mode, an empty option will be displayed with that
// text.

export default function SelectField({
  id,
  label,
  tooltip,
  options = [],
  multiple = false,
  // placeholder text for a default empty option when not using multiple select
  placeholder,
  minSelections,
  maxSelections,
  ...props
}) {
  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={id}>
          {label}
          <Tooltip text={tooltip} />
        </label>
      )}
      <select
        id={id}
        className={styles.select}
        multiple={multiple}
        data-min={minSelections}
        data-max={maxSelections}
        {...props}
      >
        {placeholder && !multiple && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const labelText = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={value} value={value}>
              {labelText}
            </option>
          );
        })}
      </select>
    </div>
  );
}
