'use client';
import React from 'react';
import styles from './Settings.module.css';
import { useSettings } from '../contexts/SettingsContext';

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

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { settings, updateSettings } = useSettings();
  const ageOptions = Array.from({ length: 96 }, (_, i) => (i + 5).toString());

  const handleSoundToggle = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const handleTimerToggle = () => {
    updateSettings({ timerEnabled: !settings.timerEnabled });
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ age: e.target.value });
  };

  const handleNationalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ nationality: e.target.value as Nationality });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ language: e.target.value as Language });
  };

  return (
    <div className={styles.settingsOverlay}>
      <div className={styles.settingsContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        
        <h2 className={styles.settingsTitle}>Game Settings</h2>
        
        <div className={styles.settingsForm}>
          {/* Sound Toggle */}
          <div className={styles.settingRow}>
            <label className={styles.settingLabel}>Sound Effects:</label>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={settings.soundEnabled}
                onChange={handleSoundToggle}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          {/* Timer Toggle - Fixed Implementation */}
          <div className={styles.settingRow}>
            <label className={styles.settingLabel}>Enable Timer:</label>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={settings.timerEnabled}
                onChange={handleTimerToggle}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          {/* Age Selection */}
          <div className={styles.settingRow}>
            <label htmlFor="ageSelect" className={styles.settingLabel}>
              Age:
            </label>
            <select
              id="ageSelect"
              value={settings.age}
              onChange={handleAgeChange}
              className={styles.selectInput}
            >
              {ageOptions.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
          </div>

          {/* Nationality Selection */}
          <div className={styles.settingRow}>
            <label htmlFor="nationalitySelect" className={styles.settingLabel}>
              Nationality:
            </label>
            <select
              id="nationalitySelect"
              value={settings.nationality}
              onChange={handleNationalityChange}
              className={styles.selectInput}
            >
              {Object.values(Nationality).map((nation) => (
                <option key={nation} value={nation}>
                  {nation}
                </option>
              ))}
            </select>
          </div>

          {/* Language Selection */}
          <div className={styles.settingRow}>
            <label htmlFor="languageSelect" className={styles.settingLabel}>
              Language:
            </label>
            <select
              id="languageSelect"
              value={settings.language}
              onChange={handleLanguageChange}
              className={styles.selectInput}
            >
              {Object.values(Language).map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.buttonContainer}>
            <button 
              type="button" 
              className={styles.saveButton}
              onClick={onClose}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;