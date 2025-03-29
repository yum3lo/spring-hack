'use client';
import React, { useState } from 'react';
import styles from './Settings.module.css';

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
  onSave: (settings: {
    soundEnabled: boolean;
    age: string;
    nationality: Nationality;
    language: Language;
    timerEnabled: boolean;
  }) => void;
  initialSettings?: {
    soundEnabled: boolean;
    age: string;
    nationality: Nationality;
    language: Language;
    timerEnabled: boolean;
  };
}

const Settings: React.FC<SettingsProps> = ({ onClose, onSave, initialSettings }) => {
  // State for all settings
  const [soundEnabled, setSoundEnabled] = useState(initialSettings?.soundEnabled ?? true);
  const [age, setAge] = useState(initialSettings?.age ?? '18');
  const [nationality, setNationality] = useState<Nationality>(initialSettings?.nationality ?? Nationality.ROMANIAN);
  const [language, setLanguage] = useState<Language>(initialSettings?.language ?? Language.ENGLISH);
  const [timerEnabled, setTimerEnabled] = useState(initialSettings?.timerEnabled ?? true);

  // Age options (7-100)
  const ageOptions = Array.from({ length: 94 }, (_, i) => (i + 7).toString());

  const handleToggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const handleToggleTimer = () => {
    setTimerEnabled(!timerEnabled);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      soundEnabled,
      age,
      nationality,
      language,
      timerEnabled
    });
    onClose();
  };

  return (
    <div className={styles.settingsOverlay}>
      <div className={styles.settingsContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        
        <h2 className={styles.settingsTitle}>Game Settings</h2>
        
        <form onSubmit={handleSubmit} className={styles.settingsForm}>
            {/* Sound Toggle */}
            <div className={styles.settingRow}>
                <label className={styles.settingLabel}>Sound Effects:</label>
                <div 
                    className={`${styles.toggleContainer} ${soundEnabled ? styles.active : ''}`}
                    onClick={handleToggleSound}
                >
                    <div className={styles.toggleKnob}></div>
                </div>
            </div>

            {/* Age Selection */}
            <div className={styles.settingRow}>
                <label htmlFor="ageSelect" className={styles.settingLabel}>
                Age:
                </label>
                <select
                id="ageSelect"
                value={age}
                onChange={(e) => setAge(e.target.value)}
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
                value={nationality}
                onChange={(e) => setNationality(e.target.value as Nationality)}
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
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className={styles.selectInput}
                >
                {Object.values(Language).map((lang) => (
                    <option key={lang} value={lang}>
                    {lang}
                    </option>
                ))}
                </select>
            </div>

            {/* Timer Toggle */}
            <div className={styles.settingRow}>
                <label className={styles.settingLabel}>Enable Timer:</label>
                <div 
                    className={`${styles.toggleContainer} ${timerEnabled ? styles.active : ''}`}
                    onClick={handleToggleTimer}
                >
                    <div className={styles.toggleKnob}></div>
                </div>
            </div>

            <div className={styles.buttonContainer}>
            <button type="submit" className={styles.saveButton}>
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;