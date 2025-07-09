import { useLanguage } from '../../../context/LanguageContext';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629' },
  { code: 'bn', label: '\u09ac\u09be\u0982\u09b2\u09be' },
  { code: 'zh', label: '\u7b80\u4f53\u4e2d\u6587' },
  { code: 'fr', label: 'Français' },
  { code: 'ht', label: 'Krey\u00f2l Ayisyen' },
  { code: 'ko', label: '\ud55c\uad6d\uc5b4' },
  { code: 'pl', label: 'Polski' },
  { code: 'ru', label: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439' },
  { code: 'es', label: 'Español' },
  { code: 'ur', label: '\u0627\u0631\u062f\u0648' },
];

export default function LanguageSelect() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="jules-form-field language-select">
      <div className="jules-input-wrapper jules-select-wrapper">
        <select
          className="jules-input"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          aria-label={t('language')}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
