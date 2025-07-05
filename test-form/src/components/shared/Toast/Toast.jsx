import React from 'react';

export default function Toast({ message, variant = 'info' }) {
  const classes = ['jules-toast', `jules-toast-${variant}`].join(' ');
  return (
    <div className={classes} role="status">
      {message}
    </div>
  );
}
