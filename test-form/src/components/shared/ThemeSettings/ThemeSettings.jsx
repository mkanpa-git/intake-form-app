import React, { useEffect, useState } from 'react';
import Modal from '../Modal/Modal';
import RadioGroup from '../RadioGroup/RadioGroup';
import Button from '../Button/Button';

export default function ThemeSettings({ isOpen, onClose, value = 'system', onChange }) {
  const [selected, setSelected] = useState(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSave = () => {
    onChange(selected);
    onClose();
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button onClick={handleSave}>Save</Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Visual Theme" footerContent={footer}>
      <RadioGroup
        id="theme-select"
        options={[
          { value: 'light', label: '☀️ Light Mode' },
          { value: 'dark', label: '🌙 Dark Mode' },
          { value: 'system', label: '🖥️ Follow Device Setting' },
        ]}
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      />
    </Modal>
  );
}
