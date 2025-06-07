import React, { useState, useEffect, useRef } from 'react';
import styles from './AddressAutocomplete.module.css';

export default function AddressAutocomplete({
  id,
  label,
  value = '',
  onChange,
  onAddressSelect,
  placeholder = '',
  ...props
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef();

  useEffect(() => {
    if (!showSuggestions) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!value) {
        setSuggestions([]);
        return;
      }

      const controller = new AbortController();
      const fetchSuggestions = async () => {
        try {
          const res = await fetch(
            `/api/places/autocomplete?input=${encodeURIComponent(value)}`,
            { signal: controller.signal }
          );
          const data = await res.json();
          setSuggestions(data.predictions || []);
        } catch (err) {
          if (err.name !== 'AbortError') console.error(err);
        }
      };

      fetchSuggestions();
      return () => controller.abort();
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, showSuggestions]);

  const handleSelect = async (place) => {
    onChange && onChange(place.description);
    setSuggestions([]);
    setShowSuggestions(false);
    try {
      const res = await fetch(`/api/places/details/${place.place_id}`);
      const data = await res.json();
      onAddressSelect && onAddressSelect(data.result || {});
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.field}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        className={styles.input}
        placeholder={placeholder}
        autoComplete="off"
        {...props}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              onMouseDown={() => handleSelect(s)}
              className={styles.suggestion}
            >
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
