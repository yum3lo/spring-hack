// contexts/SettingsContext.tsx
'use client';

import React, { createContext, useContext, useState} from 'react';

enum Nationality {
    ROMANIAN = 'Romanian',
    RUSSIAN = 'Russian',
    BRITISH = 'British',
    AMERICAN = 'American',
    GERMAN = 'German',
    FRENCH = 'French',
    SPANISH = 'Spanish',
    CHINA = 'Chinese',
    MOLDOVAN = 'Moldovan',
    TURK = 'Turkish'
  }
  
  enum Language {
    ENGLISH = 'English',
    RUSSIAN = 'Russian',
    ROMANIAN = 'Romanian',
    TURKISH = 'Turkish',
    GERMAN = 'German',
    ITALIAN = 'Italian',
    FRENCH = 'French',
    SPANISH = 'Spanish',
    CHINESE = 'Chinese',
    JAPANESE = 'Japanese'
  }
interface Settings {
  soundEnabled: boolean;
  age: string;
  nationality: Nationality;
  language: Language;
  timerEnabled: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  soundEnabled: true,
  age: '18',
  nationality: Nationality.ROMANIAN,
  language: Language.ENGLISH,
  timerEnabled: true
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {}
});

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gameSettings');
      return saved ? JSON.parse(saved) : defaultSettings;
    }
    return defaultSettings;
  });

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      // Save to localStorage
      localStorage.setItem('gameSettings', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);