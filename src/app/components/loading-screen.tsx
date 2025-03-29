// components/loading-screen.tsx
'use client';

import { useEffect } from 'react';
import { Planet } from '@/types/planets';
import { Questions } from '@/types/questions';

export default function LoadingScreen({ planet, onComplete }: {
  planet: Planet;
  onComplete: (questions: Questions) => void;
}) {
  useEffect(() => {
    const generateAndSaveQuestions = async () => {
      try {
        // Get settings from localStorage
        const settings = JSON.parse(localStorage.getItem('settings') || '{}');
        const { age, nationality, language } = settings;

        // Create the prompt
        const prompt = `Ask 10 multiple choice questions and their right answers in json format about ${planet.subject} to ask for a ${age} year old who is ${nationality} in ${language}. 
        Return only valid JSON in this exact format:
        {
          "questions": [
            {
              "question": "question text",
              "options": ["option1", "option2", "option3", "option4"],
              "correctAnswer": 0
            }
          ]
        }`;

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
        const questions = data.questions || [];
        
        // Save directly to questions.json
        const saveResponse = await fetch('/api/save-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planetId: planet.id,
            questions,
          }),
        });

        if (!saveResponse.ok) throw new Error('Failed to save questions');

        onComplete(questions);
      } catch (error) {
        console.error('Error:', error);
        // Fallback to empty questions
        onComplete([]);
      }
    };

    generateAndSaveQuestions();
  }, [planet, onComplete]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-white mb-2">Preparing Your Adventure</h2>
        <p className="text-gray-300">Generating questions about {planet.subject}...</p>
      </div>
    </div>
  );
}