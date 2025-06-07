import React, { useState, useEffect } from 'react';
import styles from './AddressAutocomplete.module.css';

export default function AddressAutocomplete({ id, label, onAddressSelect, placeholder = '', ...props }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!showSuggestions) return;
    if (!inputValue) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(inputValue)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setSuggestions(data.predictions || []);
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      }
    };

    fetchSuggestions();
    return () => controller.abort();
  }, [inputValue, showSuggestions]);

  const handleSelect = async (place) => {
    setInputValue(place.description);
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
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
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
