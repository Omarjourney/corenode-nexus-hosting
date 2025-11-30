import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';

const STORAGE_KEY = 'cnx-language';

const resolveInitialLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  const browserLang = navigator.language?.slice(0, 2).toLowerCase();
  return ['en', 'es', 'fr', 'de'].includes(browserLang) ? browserLang : 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
    },
    lng: resolveInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
    },
  });

if (typeof window !== 'undefined') {
  i18n.on('languageChanged', (lng) => {
    localStorage.setItem(STORAGE_KEY, lng);
  });
}

export default i18n;
