'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import PlanetGraph from './planet-graph';
import { Settings } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Planet, PlanetsData, Position } from '../types/planets';

const planetsData: PlanetsData = require('../data/planets.json');

type GameState = {
  currentScreen: 'space' | 'planet';
  currentPlanet: Planet | null;
  lastVisitedPlanet: Planet | null;
  rocketPosition: Position;
  isRocketMoving: boolean;
};

export default function GameContainer() {
  const rocketRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    currentScreen: 'space',
    currentPlanet: null,
    lastVisitedPlanet: null,
    rocketPosition: { x: 50, y: 90 },
    isRocketMoving: false,
  });

  const [language, setLanguage] = useState('english');
  const [ageGroup, setAgeGroup] = useState('5-7');

  // Get available planets based on last visited planet
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

  // Update rocket position using CSS transforms
  useEffect(() => {
    if (rocketRef.current) {
      rocketRef.current.style.transform = `translate(calc(${gameState.rocketPosition.x}% - 50%), calc(${gameState.rocketPosition.y}% - 50%))`;
    }
  }, [gameState.rocketPosition]);

  const animateRocket = (targetPosition: Position, onComplete: () => void) => {
    const startPosition = { ...gameState.rocketPosition };
    const duration = 1500;
    const startTime = performance.now();

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
        lastVisitedPlanet: planet
      }));
    });
  };

  const returnToSpace = () => {
    animateRocket({ x: 50, y: 90 }, () => {
      setGameState(prev => ({
        ...prev,
        isRocketMoving: false,
        currentScreen: 'space',
        currentPlanet: null
      }));
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/bkg.png")' }} />
      <div className="absolute inset-0 bg-black/30" />

      {/* Settings Button */}
      <div className="absolute top-4 right-4 z-50">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-gray-800/80 hover:bg-gray-700/90 text-white hover:text-white h-10 w-10"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 bg-gray-800/90 backdrop-blur-sm border-gray-700" align="end" sideOffset={8}>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Settings</h3>
              <div className="space-y-2">
                <Label htmlFor="language" className="text-gray-300">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectGroup>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age-group" className="text-gray-300">Age Group</Label>
                <Select value={ageGroup} onValueChange={setAgeGroup}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectGroup>
                      <SelectItem value="5-7">5-7 years</SelectItem>
                      <SelectItem value="8-10">8-10 years</SelectItem>
                      <SelectItem value="11-13">11-13 years</SelectItem>
                      <SelectItem value="14+">14+ years</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Save Settings
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Rocket */}
      <div 
        ref={rocketRef}
        className={`absolute z-20 w-12 h-24 transition-transform duration-300 will-change-transform ${
          gameState.isRocketMoving ? 'animate-pulse' : ''
        }`}
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(calc(50% - 50%), calc(90% - 50%))',
        }}
      >
        <Image
          src="/rocket.png"
          alt="Rocket"
          fill
          className={`object-contain transition-transform duration-300 ${
            gameState.isRocketMoving ? 'rotate-12' : 'rotate-0'
          }`}
          priority
        />
      </div>

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
                  priority
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
                  onClick={() => console.log('Start questions for', gameState.currentPlanet?.subject)}
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