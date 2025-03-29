'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './GameScene.module.css';
import PixelCard from '../components/PixelCard';
import Settings from '../settings/Settings';
import { useSettings } from '../contexts/SettingsContext';
import '@fontsource/dotgothic16';
import questionsData from '@/data/questions.json';
import { Planet } from '@/types/planets';
import { Questions } from '@/types/questions';

export interface GameSceneProps {
  planet: Planet;
  questions: Questions;
  onClose: () => void;
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
  },
  {
    question: "What is 9 - 4?",
    options: ["5", "6", "7", "8"],
    correct_answer: "5"
  }
];

const GameScene = ({ planet, onClose}: GameSceneProps) => {
  const { settings } = useSettings();
  const [questions, setQuestions] = useState<Question[]>([]);
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

  // Load questions
  useEffect(() => {
    try {
      const loadedQuestions = (questionsData as { questions: Question[] }).questions;
      if (Array.isArray(loadedQuestions) && loadedQuestions.length > 0) {
        setQuestions(loadedQuestions);
        setError(null);
      } else {
        setQuestions(FALLBACK_QUESTIONS);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      setQuestions(FALLBACK_QUESTIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  // Timer countdown (respects timer setting)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameActive && !loading && settings.timerEnabled) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
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
      const timeBonus = settings.timerEnabled ? Math.floor(timeLeft * 2) : 0;
      const answerReward = 50;
      const total = answerReward + timeBonus;
      
      setScore(prev => prev + total);
      setMoney(prev => prev + total);
      setRewardPopup({ show: true, amount: total });
      
      if (settings.soundEnabled) {
        // new Audio('/sounds/correct.mp3').play();
      }
    } else {
      setMoney(prev => Math.max(0, prev - 20));
      
      if (settings.soundEnabled) {
        // new Audio('/sounds/wrong.mp3').play();
      }
    }
    
    setGameActive(false);
    setTimeout(() => {
      setRewardPopup({ show: false, amount: 0 });
      nextQuestion();
    }, 1500);
  };

  const nextQuestion = () => {
    setTimeout(() => {
      setCurrentQuestionIndex(prev => (prev + 1) % questions.length);
      if (settings.timerEnabled) {
        setTimeLeft(30);
      }
      setGameActive(true);
      setSelectedAnswer(null);
    }, 500);
  };

  if (loading) {
    return <div className={styles.loading}>Loading questions...</div>;
  }

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
      
      {/* Back Button */}
      <button 
        className={styles.backButton}
        onClick={onClose}
        aria-label="Back to planet"
      >
        ← Back
      </button>
      
      {/* Settings Button */}
      <button 
        className={styles.settingsButton}
        onClick={() => setShowSettings(true)}
        aria-label="Open settings"
      >
        <Image 
          src="/images/settings.png" 
          width={30} 
          height={30} 
          alt="Settings" 
        />
      </button>
      
      {/* Settings Modal */}
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
      
      {/* Background Image - Now using planet's background */}
      <div className={styles.backgroundContainer}>
        <Image
          src={planet.background || "/images/Background.png"}
          alt={`${planet.name} Background`}
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
            <Image src="/images/timer.png" width={60} height={60} alt="Time" />
            <span>{timeLeft}s</span>
          </div>
        )}
        <div className={styles.statusItem}>
          <Image src="/images/points.png" width={60} height={60} alt="Score" />
          <span>{score}</span>
        </div>
        <div className={styles.statusItem}>
          <Image src="/images/coin.png" width={60} height={60} alt="Money" />
          <span>${money}</span>
        </div>
      </div>
      
      {/* Character Display */}
      <div className={styles.characterDisplay}>
        <div className={styles.astronautContainer}>
          <Image
            src="/images/Astronaut.png"
            alt="Astronaut"
            width={140}
            height={140}
            className={styles.characterImage}
          />
        </div>
        <div className={styles.aliensContainer}>
          <Image
            src="/images/Alien 1.png"
            alt="Alien 1"
            width={140}
            height={140}
            className={styles.alienImage}
          />
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
                {showCorrect && (
                  <div className={styles.correctIndicator}>✓</div>
                )}
              </PixelCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameScene;