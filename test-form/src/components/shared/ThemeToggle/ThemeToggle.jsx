import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';
  const icon = isDark ? faSun : faMoon;
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={label}
      onClick={onToggle}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}
