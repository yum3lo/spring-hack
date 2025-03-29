'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import PlanetGraph from './planet-graph';
import GameScene from '@/app/planets/gamescene';
import { Planet, PlanetsData, Position } from '../types/planets';
import Settings from '@/app/settings/Settings';
import LoadingScreen from '@/app/components/loading-screen';
import styles from '@/app/planets/GameScene.module.css';
import { Questions } from '@/types/questions';

const planetsData: PlanetsData = require('../data/planets.json');

type GameState = {
  currentScreen: 'space' | 'planet' | 'loading';
  currentPlanet: Planet | null;
  lastVisitedPlanet: Planet | null;
  rocketPosition: Position;
  rocketRotation: number;
  isRocketMoving: boolean;
  visitedPlanets: string[];
};

export default function GameContainer() {
  const rocketRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    currentScreen: 'space',
    currentPlanet: null,
    lastVisitedPlanet: null,
    rocketPosition: { x: 50, y: 85 },
    rocketRotation: 0,
    isRocketMoving: false,
    visitedPlanets: []
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const [showGameScene, setShowGameScene] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<
    {
      question: string;
      options: string[];
      correctAnswer: number;
    }[]
  >([]);

  const getAvailablePlanets = (): Planet[] => {
    if (!gameState.lastVisitedPlanet) {
      return planetsData.planets;
    }
    
    return planetsData.planets.filter(planet => 
      gameState.lastVisitedPlanet?.connections.includes(planet.id) ||
      planetsData.connections.some(conn => 
        conn.from === planet.id && conn.to === gameState.lastVisitedPlanet?.id
      )
    );
  };

  const calculateRotation = (start: Position, end: Position) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    return Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  };

  const animateRocket = (targetPosition: Position, onComplete: () => void) => {
    const startPosition = { ...gameState.rocketPosition };
    const duration = 1500;
    const startTime = performance.now();

    const targetRotation = calculateRotation(startPosition, targetPosition);
    
    setGameState(prev => ({
      ...prev,
      rocketRotation: targetRotation,
      isRocketMoving: true
    }));

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const newX = startPosition.x + (targetPosition.x - startPosition.x) * easedProgress;
      const newY = startPosition.y + (targetPosition.y - startPosition.y) * easedProgress;
      
      setGameState(prev => ({
        ...prev,
        rocketPosition: { x: newX, y: newY },
        isRocketMoving: true
      }));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    requestAnimationFrame(animate);
  };

  const handlePlanetSelect = (planet: Planet) => {
    animateRocket(planet.position, () => {
      setGameState(prev => ({
        ...prev,
        isRocketMoving: false,
        currentScreen: 'planet',
        currentPlanet: planet,
        lastVisitedPlanet: planet,
        visitedPlanets: [...prev.visitedPlanets, planet.id]
      }));
    });
  };

  const handleStartAdventure = () => {
    if (!gameState.currentPlanet) return;
    setGameState(prev => ({
      ...prev,
      currentScreen: 'loading'
    }));
  };

  const handleQuestionsGenerated = (questions: Questions) => {
    setGeneratedQuestions(questions);
    setShowGameScene(true);
    setGameState(prev => ({
      ...prev,
      currentScreen: 'planet'
    }));
  };

  const handleLoadingBack = () => {
    setGameState(prev => ({
      ...prev,
      currentScreen: 'planet'
    }));
  };

  const returnToSpace = () => {
    animateRocket({ x: 50, y: 85 }, () => {
      setGameState(prev => ({
        ...prev,
        isRocketMoving: false,
        currentScreen: 'space',
        currentPlanet: null,
        rocketRotation: 0
      }));
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/bkg.png")' }} />
      <div className="absolute inset-0 bg-black/30" />

      {/* Loading Screen */}
      {gameState.currentScreen === 'loading' && gameState.currentPlanet && (
        <LoadingScreen 
          planet={gameState.currentPlanet}
          loadingMessage={`Preparing ${gameState.currentPlanet.subject} Challenge`}
          onComplete={handleQuestionsGenerated}
          onBack={handleLoadingBack}
        />
      )}
      
      {/* Settings */}
      <button 
        className={styles.settingsButton}
        onClick={() => setShowSettings(true)}
        aria-label="Open settings"
      >
        <Image 
          src="/images/settings.png" 
          width={80} 
          height={80} 
          alt="Settings" 
        />
      </button>

      {/* Settings Modal */}
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}

      {/* Rocket */}
      {gameState.currentScreen === 'space' && (
        <div 
          ref={rocketRef}
          className={`absolute z-20 w-12 h-24 transition-transform duration-300 ${
            gameState.isRocketMoving ? 'animate-pulse' : ''
          }`}
          style={{
            left: `${gameState.rocketPosition.x}%`,
            top: `${gameState.rocketPosition.y}%`,
            transform: `translate(-50%, -50%) rotate(${gameState.rocketRotation}deg)`,
          }}
        >
          <Image
            src="/rocket.png"
            alt="Rocket"
            fill
            className="object-contain"
            priority
          />
        </div>
      )}

      {/* Planet Selection View */}
      {gameState.currentScreen === 'space' && (
        <div className="absolute inset-0 z-10">
          <PlanetGraph 
            onPlanetSelect={handlePlanetSelect}
            availablePlanets={getAvailablePlanets()}
            lastVisitedPlanet={gameState.lastVisitedPlanet}
          />
          
          <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm animate-bounce">
            {gameState.lastVisitedPlanet 
              ? "Click on a connected planet to explore!" 
              : "Click on any planet to begin your journey!"}
          </div>
        </div>
      )}
        
      {/* Planet View */}
      {gameState.currentScreen === 'planet' && gameState.currentPlanet && !showGameScene && !isGeneratingQuestions && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-4 border border-white/10">
            <button 
              onClick={returnToSpace}
              className="absolute cursor-pointer top-4 right-4 text-white hover:text-yellow-300 transition-colors"
            >
              ← Back to space
            </button>
            
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 my-6">
                <Image
                  src={gameState.currentPlanet.image}
                  alt={gameState.currentPlanet.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              <h2 className="text-3xl font-bold text-center mb-2 text-white">
                {gameState.currentPlanet.name}
              </h2>
              <p className="text-lg text-center mb-6 text-gray-300">
                {gameState.currentPlanet.subject} Planet
              </p>
              
              <button 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-lg transition-colors cursor-pointer"
                onClick={handleStartAdventure}
              >
                Start Learning Adventure
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Screen for Question Generation */}
      {isGeneratingQuestions && gameState.currentPlanet && (
        <LoadingScreen 
          planet={gameState.currentPlanet}
          onComplete={handleQuestionsGenerated}
        />
      )}

      {/* GameScene */}
      {showGameScene && gameState.currentPlanet && (
        <GameScene 
          planet={gameState.currentPlanet}
          questions={generatedQuestions}
          onClose={() => {
            setShowGameScene(false);
            setGeneratedQuestions([]);
          }}
        />
      )}
    </div>
  );
}