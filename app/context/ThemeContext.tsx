'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
  textToSpeechEnabled: boolean;
  toggleTextToSpeech: () => void;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedTextToSpeech = localStorage.getItem('textToSpeechEnabled') === 'true';
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
    setTextToSpeechEnabled(savedTextToSpeech);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      root.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      localStorage.setItem('textToSpeechEnabled', textToSpeechEnabled.toString());
    }
  }, [theme, mounted, textToSpeechEnabled]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const toggleTextToSpeech = () => {
    setTextToSpeechEnabled(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted, textToSpeechEnabled, toggleTextToSpeech }}>
      {children}
    </ThemeContext.Provider>
  );
}
