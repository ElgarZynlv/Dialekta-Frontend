import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as FileSystem from 'expo-file-system';
import { Language, TRANSLATIONS, Translations } from '../constants/translations';

const LANG_FILE = FileSystem.documentDirectory + 'lang.txt';
const ONBOARDING_FILE = FileSystem.documentDirectory + 'onboarded.txt';

interface LanguageContextType {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
  isLoaded: boolean;
  hasChosen: boolean;
  hasSeenOnboarding: boolean;
  markOnboardingSeen: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'az',
  t: TRANSLATIONS['az'],
  setLanguage: () => {},
  isLoaded: false,
  hasChosen: false,
  hasSeenOnboarding: false,
  markOnboardingSeen: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<Language>('az');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasChosen, setHasChosen] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    Promise.all([
      FileSystem.readAsStringAsync(LANG_FILE).catch(() => null),
      FileSystem.readAsStringAsync(ONBOARDING_FILE).catch(() => null),
    ]).then(([savedLang, savedOnboarding]) => {
      if (savedLang) {
        const lang = savedLang.trim() as Language;
        if (TRANSLATIONS[lang]) { setLang(lang); setHasChosen(true); }
      }
      if (savedOnboarding === '1') setHasSeenOnboarding(true);
    }).finally(() => setIsLoaded(true));
  }, []);

  const setLanguage = (lang: Language) => {
    setLang(lang);
    setHasChosen(true);
    FileSystem.writeAsStringAsync(LANG_FILE, lang).catch(() => {});
  };

  const markOnboardingSeen = () => {
    setHasSeenOnboarding(true);
    FileSystem.writeAsStringAsync(ONBOARDING_FILE, '1').catch(() => {});
  };

  return (
    <LanguageContext.Provider
      value={{ language, t: TRANSLATIONS[language], setLanguage, isLoaded, hasChosen, hasSeenOnboarding, markOnboardingSeen }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
