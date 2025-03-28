'use client';

import { useState } from 'react';
import Image from 'next/image';
import PlanetGraph from './planet-graph';

export default function GameContainer() {
  const [gameState, setGameState] = useState({
    currentScreen: 'space',
    currentPlanet: null,
    rocketPosition: { x: 50, y: 90 },
    isRocketMoving: false,
    visitedPlanets: []
  });

  const handlePlanetSelect = (planet) => {
    setGameState(prev => ({
      ...prev,
      isRocketMoving: true,
      currentPlanet: planet
    }));

    const animationDuration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      const easedProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const newX = 50 + (planet.position.x - 50) * easedProgress;
      const newY = 90 + (planet.position.y - 90) * easedProgress;
      
      setGameState(prev => ({
        ...prev,
        rocketPosition: { x: newX, y: newY }
      }));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setGameState(prev => ({
          ...prev,
          isRocketMoving: false,
          currentScreen: 'planet',
          visitedPlanets: [...prev.visitedPlanets, planet.id]
        }));
      }
    };

    requestAnimationFrame(animate);
  };

  const returnToSpace = () => {
    setGameState(prev => ({
      ...prev,
      currentScreen: 'space',
      isRocketMoving: true
    }));

    const animationDuration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      const easedProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const currentPlanet = gameState.currentPlanet;
      const newX = currentPlanet.position.x + (50 - currentPlanet.position.x) * easedProgress;
      const newY = currentPlanet.position.y + (90 - currentPlanet.position.y) * easedProgress;
      
      setGameState(prev => ({
        ...prev,
        rocketPosition: { x: newX, y: newY }
      }));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setGameState(prev => ({
          ...prev,
          isRocketMoving: false,
          currentPlanet: null
        }));
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 bg-space-bg bg-cover bg-center opacity-70" />
      
      {/* Rocket */}
      <div 
        className={`absolute z-20 transition-transform duration-300 ${
          gameState.isRocketMoving ? 'animate-pulse' : ''
        }`}
        style={{
          left: `${gameState.rocketPosition.x}%`,
          top: `${gameState.rocketPosition.y}%`,
          transform: 'translate(-50%, -50%)',
          transition: gameState.isRocketMoving 
            ? 'left 0.1s linear, top 0.1s linear' 
            : 'left 0.3s ease-out, top 0.3s ease-out'
        }}
      >
        <Image
          src="/rocket.png"
          alt="Rocket"
          width={48}
          height={96}
          className={`w-12 h-auto transition-transform ${
            gameState.isRocketMoving ? 'rotate-12' : 'rotate-0'
          }`}
        />
      </div>

      {/* Planet Selection View */}
      {gameState.currentScreen === 'space' && (
        <div className="absolute inset-0 z-10">
          <PlanetGraph 
            onPlanetSelect={handlePlanetSelect}
            visitedPlanets={gameState.visitedPlanets}
          />
          
          {/* Navigation Prompt */}
          <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm animate-bounce">
            Click on a planet to explore!
          </div>
        </div>
      )}

      {/* Planet View */}
      {gameState.currentScreen === 'planet' && gameState.currentPlanet && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-4 border border-white/10">
            <button 
              onClick={returnToSpace}
              className="absolute top-4 right-4 text-white hover:text-yellow-300 transition-colors"
            >
              ← Back to space
            </button>
            
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-6">
                <Image
                  src={gameState.currentPlanet.image}
                  alt={gameState.currentPlanet.name}
                  fill
                  className="object-contain"
                />
              </div>
              
              <h2 className="text-3xl font-bold text-center mb-2 text-white">
                {gameState.currentPlanet.name}
              </h2>
              <p className="text-lg text-center mb-6 text-gray-300">
                {gameState.currentPlanet.subject} Planet
              </p>
              
              <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4 text-center text-white">
                  Ready to explore {gameState.currentPlanet.subject}?
                </h3>
                <button 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-lg transition-colors"
                  onClick={() => {
                    // You'll implement the question logic here later
                    console.log('Start questions for', gameState.currentPlanet.subject);
                  }}
                >
                  Start Learning Adventure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}