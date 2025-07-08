import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

const supported = ['en','ar','bn','zh','fr','ht','ko','pl','ru','es','ur'];

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    supportedLngs: supported,
    interpolation: { escapeValue: false },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
  });

export default i18n;
