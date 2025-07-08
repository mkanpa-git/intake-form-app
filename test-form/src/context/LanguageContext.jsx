import { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext({ language: 'en', setLanguage: () => {} });

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('language');
    if (saved) {
      setLanguage(saved);
      i18n.changeLanguage(saved);
    }
  }, []);

  const update = (lng) => {
    setLanguage(lng);
    localStorage.setItem('language', lng);
    i18n.changeLanguage(lng);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: update }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
