'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Planet } from '@/types/planets';
import { Question, Questions, QuestionsWrapper } from '@/types/questions';

interface LoadingScreenProps {
  planet: Planet;
  loadingMessage?: string;
  onComplete: (questions: Questions) => void;
  onBack?: () => void;
}

export default function LoadingScreen({ 
  planet, 
  loadingMessage, 
  onComplete, 
  onBack 
}: LoadingScreenProps) {
  useEffect(() => {
    const generateQuestions = async () => {
      try {
        // Get settings from localStorage
        const settings = JSON.parse(localStorage.getItem('settings') || '{}');
        const { age, nationality, language } = settings;

        // Create the prompt
        const prompt = `Generate 10 multiple choice questions about ${planet.subject} 
        for a ${age} year old ${nationality} student in ${language}. 
        Format as JSON with question, options, and correctAnswer.`;

        // Simulate API call (replace with actual fetch)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock response - adjust based on your actual API response format
        const mockResponse: QuestionsWrapper = {
          questions: [
            {
              question: `What is the capital of ${planet.name}?`,
              options: ["Option 1", "Option 2", "Option 3", "Option 4"],
              correctAnswer: 0
            }
          ]
        };

        // Convert to Questions array format if needed
        const questions: Questions = mockResponse.questions || [];
        onComplete(questions);
      } catch (error) {
        console.error('Error generating questions:', error);
        onComplete([]); // Return empty array on error
      }
    };

    generateQuestions();
  }, [planet, onComplete]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="text-center p-6 rounded-lg max-w-md w-full">
        {/* Back button (optional) */}
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-700/50 transition-colors"
          >
            ← Cancel
          </button>
        )}
        
        {/* Loading animation */}
        <div className="relative w-64 h-64 mx-auto mb-6">
          <Image
            src="/loading-screen.gif"
            alt="Loading"
            fill
            className="object-contain"
            unoptimized
            priority
          />
        </div>
        
        {/* Loading message */}
        <h2 className="text-xl font-bold text-white mb-2">
          {loadingMessage || `Preparing ${planet.subject} Adventure`}
        </h2>
        <p className="text-gray-300">
          Generating questions about {planet.name}...
        </p>
      </div>
    </div>
  );
}