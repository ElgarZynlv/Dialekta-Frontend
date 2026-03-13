import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as FileSystem from 'expo-file-system';
import { Theme, DARK, LIGHT } from '../constants/themes';

const THEME_FILE = FileSystem.documentDirectory + 'theme.txt';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: DARK,
  isDark: true,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    FileSystem.readAsStringAsync(THEME_FILE)
      .then((val) => { if (val.trim() === 'light') setIsDark(false); })
      .catch(() => {});
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    FileSystem.writeAsStringAsync(THEME_FILE, next ? 'dark' : 'light').catch(() => {});
  };

  return (
    <ThemeContext.Provider value={{ theme: isDark ? DARK : LIGHT, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
