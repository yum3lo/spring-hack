// contexts/SettingsContext.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';

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
  loadSettingsFromFile: () => Promise<void>;
  saveSettingsToFile: () => Promise<void>;
  loading: boolean;
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
  updateSettings: () => {},
  loadSettingsFromFile: async () => {},
  saveSettingsToFile: async () => {},
  loading: false
});

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null);

  const loadSettingsFromFile = async () => {
    try {
      setLoading(true);
      
      // Check for File System Access API support
      if ('showOpenFilePicker' in window) {
        try {
          // @ts-expect-error - File System Access API
          const [handle] = await window.showOpenFilePicker({
            types: [{
              description: 'JSON Files',
              accept: { 'application/json': ['.json'] }
            }],
            multiple: false
          });
          
          const file = await handle.getFile();
          const contents = await file.text();
          const data = JSON.parse(contents);
          
          if (data.settings && data.settings.length > 0) {
            setSettings(data.settings[0]);
          }
          setFileHandle(handle);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          console.log('User cancelled file selection or API not available');
        }
      } else {
        // Fallback for browsers without File System Access API
        console.warn('File System Access API not supported, using default settings');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettingsToFile = async () => {
    try {
      setLoading(true);
      const data = {
        settings: [settings]
      };
      const json = JSON.stringify(data, null, 2);
      
      if (fileHandle && 'showSaveFilePicker' in window) {
        // If we have a file handle, try to write to it
        const writable = await fileHandle.createWritable();
        await writable.write(json);
        await writable.close();
      } else if ('showSaveFilePicker' in window) {
        // @ts-expect-error - File System Access API
        const handle = await window.showSaveFilePicker({
          types: [{
            description: 'JSON Files',
            accept: { 'application/json': ['.json'] }
          }],
          suggestedName: 'gameSettings.json'
        });
        
        const writable = await handle.createWritable();
        await writable.write(json);
        await writable.close();
        setFileHandle(handle);
      } else {
        // Fallback for browsers without File System Access API
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gameSettings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSettings, 
      loadSettingsFromFile, 
      saveSettingsToFile, 
      loading 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);