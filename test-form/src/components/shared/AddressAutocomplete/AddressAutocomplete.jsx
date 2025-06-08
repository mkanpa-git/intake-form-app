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
  const sessionTokenRef = useRef(crypto.randomUUID());

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
            `/api/places/autocomplete?input=${encodeURIComponent(value)}&sessiontoken=${sessionTokenRef.current}`,
            { signal: controller.signal }
          );
          const data = await res.json();
          setSuggestions(
            data.suggestions?.map((s) => ({
              displayName: s.placePrediction?.text?.text ?? '',
              placeId: s.placePrediction?.placeId,
            })) || []
          );
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
    const displayText = place.displayName;

    onChange?.(displayText);
    setSuggestions([]);
    setShowSuggestions(false);

    let details = null;
    if (place.placeId) {
      try {
        const res = await fetch(
          `/api/places/details/${place.placeId}?sessiontoken=${sessionTokenRef.current}`
        );
        details = await res.json();
      } catch (err) {
        console.error(err);
      }
    }

    if (onAddressSelect) {
      onAddressSelect(details || {
        formatted_address: displayText,
        place_id: place.placeId || null,
        address_components: [],
        name: displayText,
      });
    }

    sessionTokenRef.current = crypto.randomUUID();
  };

  return (
    <div className={styles.field}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        className={styles.input}
        placeholder={placeholder}
        autoComplete="off"
        {...props}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((s, i) => (
            <li
              key={`${s.displayName}-${i}`}
              onMouseDown={() => handleSelect(s)}
              className={styles.suggestion}
            >
              {s.displayName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
