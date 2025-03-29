'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './GameScene.module.css';
import PixelCard from '../components/PixelCard';
import Settings from '../settings/Settings';
import '@fontsource/dotgothic16';
import questionsData from '@/data/questions.json';

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

interface Question {
  question: string;
  options: string[];
  correct_answer: string;
}

const FALLBACK_QUESTIONS: Question[] = [
  {
    question: "What is 5 + 7?",
    options: ["10", "11", "12", "13"],
    correct_answer: "12"
  }
];

const GameScene = () => {
  // Game state
  const [questions, setQuestions] = useState<Question[]>(FALLBACK_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [money, setMoney] = useState(100);
  const [gameActive, setGameActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [rewardPopup, setRewardPopup] = useState({ show: false, amount: 0 });
  const [showSettings, setShowSettings] = useState(false);

    // Settings state
  const [settings, setSettings] = useState({
    soundEnabled: true,
    age: '18',
    nationality: Nationality.ROMANIAN,
    language: Language.ENGLISH,
    timerEnabled: true
  });

  // Load questions
  useEffect(() => {
    try {
      const loadedQuestions = (questionsData as { questions: Question[] }).questions;
      if (Array.isArray(loadedQuestions) && loadedQuestions.length > 0) {
        setQuestions(loadedQuestions);
        setError(null);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameActive && !loading && settings.timerEnabled) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameActive, loading, settings.timerEnabled]);

  const handleTimeOut = () => {
    setGameActive(false);
    setMoney(prev => Math.max(0, prev - 10));
    nextQuestion();
  };

  const handleAnswer = (selectedOption: string) => {
    if (!gameActive || loading) return;
    
    setSelectedAnswer(selectedOption);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correct_answer;
    
    if (isCorrect) {
      // Calculate bonus based on timer setting
      const timeBonus = settings.timerEnabled ? Math.floor(timeLeft * 2) : 0;
      const answerReward = 50;
      const total = answerReward + timeBonus;
      
      setScore(prev => prev + total);
      setMoney(prev => prev + total);
      setRewardPopup({ show: true, amount: total });
    } else {
      setMoney(prev => Math.max(0, prev - 20));
    }
    
    setGameActive(false);
    setTimeout(() => {
      setRewardPopup({ show: false, amount: 0 });
      nextQuestion();
    }, 800);
  };

  const nextQuestion = () => {
    setTimeout(() => {
      setCurrentQuestionIndex(prev => (prev + 1) % questions.length);
      // Reset timer only if it's enabled
      if (settings.timerEnabled) {
        setTimeLeft(30);
      }
      setGameActive(true);
      setSelectedAnswer(null);
    }, 500);
  };

  if (loading) return <div className={styles.loading}>Loading questions...</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const correctAnswer = currentQuestion.correct_answer;

  return (
    <div className={styles.gameScene}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      {rewardPopup.show && (
        <div className={styles.rewardPopup}>
          +${rewardPopup.amount}!
        </div>
      )}

            {/* Settings Button */}
    <button 
        className={styles.settingsButton}
        onClick={() => setShowSettings(true)}
    >
        <Image 
          src="/icons/settings.png" 
          width={24} 
          height={24} 
          alt="Settings" 
        />
    </button>
      
      {/* Settings Modal */}
    {showSettings && (
        <Settings
            onClose={() => setShowSettings(false)}
            onSave={(newSettings) => {
                setSettings(newSettings);
                setShowSettings(false);
            }}
            initialSettings={settings}
        />
    )}
      
      {/* Background Image */}
      <div className={styles.backgroundContainer}>
        <Image
          src="/images/Background.png"
          alt="Game Background"
          fill
          priority
          quality={90}
          style={{ objectFit: 'cover' }}
        />
      </div>
      
      {/* Game Status Bar */}
      <div className={styles.statusBar}>
        {settings.timerEnabled && (
          <div className={`${styles.statusItem} ${timeLeft <= 5 ? styles.timeWarning : ''}`}>
            <Image src="/icons/time.png" width={24} height={24} alt="Time" />
            <span>{timeLeft}s</span>
          </div>
        )}
        <div className={styles.statusItem}>
          <Image src="/icons/score.png" width={24} height={24} alt="Score" />
          <span>{score}</span>
        </div>
        <div className={styles.statusItem}>
          <Image src="/icons/money.png" width={24} height={24} alt="Money" />
          <span>${money}</span>
        </div>
      </div>
      
      {/* Question Box */}
      <div className={styles.questionBoxContainer}>
        <div className={styles.questionBoxImageWrapper}>
          <Image
            src="/images/QuestionBox.png"
            alt="Question Box"
            fill
            quality={90}
            style={{ objectFit: 'contain' }}
          />
        </div>
        
        <div className={styles.questionText}>{currentQuestion.question}</div>
        
        <div className={styles.answersContainer}>
          {currentQuestion.options.map((option, index) => {
            const isCorrect = option === correctAnswer;
            const isSelected = option === selectedAnswer;
            const showCorrect = !gameActive && isCorrect;
            const showIncorrect = !gameActive && isSelected && !isCorrect;
            
            return (
              <PixelCard 
                key={index}
                variant={showCorrect ? "blue" : showIncorrect ? "pink" : "default"}
                className={`${styles.answerCard} ${!gameActive ? styles.disabled : ''}`}
                onClick={() => handleAnswer(option)}
              >
                <div className={styles.answerText}>{option}</div>
              </PixelCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameScene;