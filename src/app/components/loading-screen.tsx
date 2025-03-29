'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Planet } from '@/types/planets';
import { Questions} from '@/types/questions';
import { useSettings } from '@/app/contexts/SettingsContext';

interface LoadingScreenProps {
interface LoadingScreenProps {
  planet: Planet;
  loadingMessage?: string;
  loadingMessage?: string;
  onComplete: (questions: Questions) => void;
  onBack?: () => void;
}

// Minimum loading time in milliseconds (3 seconds)
const MIN_LOADING_TIME = 10000;

export default function LoadingScreen({ 
  planet, 
  loadingMessage, 
  onComplete, 
  onBack 
}: LoadingScreenProps) {
  const { settings } = useSettings();
  const { age, nationality, language } = settings;
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let loadingTimer: NodeJS.Timeout;
    const startTime = Date.now() - MIN_LOADING_TIME;

    const generateQuestions = async () => {
      try {
        console.log('Using settings:', { age, nationality, language });

        // Start progress animation
        loadingTimer = setInterval(() => {
          const elapsed = Date.now() - startTime;
          setProgress(Math.min(100, (elapsed / MIN_LOADING_TIME) * 100));
        }, 50);

        // Create the prompt
        const prompt = `Generate 10 multiple choice questions about ${planet.subject} 
        for a ${age} year old ${nationality} student in ${language}. 
        Format as JSON with question, options, and correctAnswer.`;
        const prompt = `Generate 10 multiple choice questions about ${planet.subject} 
        for a ${age} year old ${nationality} student in ${language}. 
        Format as JSON with question, options, and correctAnswer.`;

        // Call your AI API
        const response = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) throw new Error('Failed to generate questions');
        const data = await response.json();
        const questions: Questions = data.questions || [];

        // Ensure minimum loading time
        const remainingTime = MIN_LOADING_TIME - (Date.now() - startTime);
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }

        onComplete(questions);
      } catch (error) {
        console.error('Error generating questions:', error);
        onComplete([]);
      } finally {
        clearInterval(loadingTimer);
        setIsLoading(false);
      }
    };

    generateQuestions();

    return () => {
      clearInterval(loadingTimer);
    };
  }, [planet, onComplete, age, nationality, language]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="text-center p-6 rounded-lg max-w-md w-full">
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-700/50 transition-colors"
            aria-label="Go back"
          >
            ← Cancel
          </button>
        )}
        
        <div className="relative width-full mx-auto mb-6">
          <Image
            src="/loading-screen.gif"
            alt="Loading"
            fill
            className="object-contain"
            unoptimized
            priority
          />
          {isLoading && (
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-700 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
        
        <h2 className="text-xl font-bold text-white mb-2">
          {loadingMessage || `Preparing ${planet.subject} Adventure`}
        </h2>
        <p className="text-gray-300 mb-4">
          Generating questions about {planet.name}...
        </p>
        
        <div className="text-sm text-gray-400">
          <p>For: {age} year old</p>
          <p>Language: {language}</p>
        </div>
      </div>
    </div>
  );
}