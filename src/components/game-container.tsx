'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import PlanetGraph from './planet-graph';
import { Settings } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Position = { x: number; y: number };
type Planet = {
  id: string;
  name: string;
  subject: string;
  position: Position;
  image: string;
};

type GameState = {
  currentScreen: 'space' | 'planet';
  currentPlanet: Planet | null;
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
    rocketPosition: { x: 50, y: 85 },
    rocketRotation: 0,
    isRocketMoving: false,
    visitedPlanets: []
  });

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
      
      // Linear interpolation for position
      const newX = startPosition.x + (targetPosition.x - startPosition.x) * progress;
      const newY = startPosition.y + (targetPosition.y - startPosition.y) * progress;
      
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
        visitedPlanets: [...prev.visitedPlanets, planet.id]
      }));
    });
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

  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState('english');
  const [ageGroup, setAgeGroup] = useState('5-7');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/bkg.png")' }}
      />
        <div className="absolute inset-0 bg-space-bg bg-cover bg-center opacity-70" />
        <div className="absolute top-4 right-4 z-50">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer bg-gray-800/80 hover:bg-gray-700/90 text-white hover:text-white h-10 w-10"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-72 bg-gray-800/90 backdrop-blur-sm border-gray-700"
            align="end"
            sideOffset={8}
          >
            <div className="space-y-4">
              <h3 className="text-lg font-medium font-mono text-white">Settings</h3>
              
              <div className="space-y-2">
                <Label htmlFor="language" className="text-gray-300 font-mono">
                  Language
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-gray-700 font-mono border-gray-600 text-white">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 font-mono text-white border-gray-700">
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
                <Label htmlFor="age-group" className="font-mono text-gray-300">
                  Age Group
                </Label>
                <Select value={ageGroup} onValueChange={setAgeGroup}>
                  <SelectTrigger className="bg-gray-700 font-mono border-gray-600 text-white">
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 font-mono text-white border-gray-700">
                    <SelectGroup>
                      <SelectItem value="5-7">5-7 years</SelectItem>
                      <SelectItem value="8-10">8-10 years</SelectItem>
                      <SelectItem value="11-13">11-13 years</SelectItem>
                      <SelectItem value="14+">14+ years</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full font-mono bg-blue-600 cursor-pointer hover:bg-blue-700"
                onClick={() => {
                  console.log({ language, ageGroup });
                }}
              >
                Save Settings
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
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

        {gameState.currentScreen === 'space' && (
          <div className="absolute inset-0 z-10">
            <PlanetGraph 
              onPlanetSelect={handlePlanetSelect}
              visitedPlanets={gameState.visitedPlanets}
            />
            
            <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm font-mono animate-bounce">
              Click on a planet to explore!
            </div>
          </div>
        )}
        
        {gameState.currentScreen === 'planet' && gameState.currentPlanet && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-4 border border-white/10">
              <button 
                onClick={returnToSpace}
                className="absolute cursor-pointer top-4 font-mono right-4 text-white hover:text-yellow-300 transition-colors"
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
                
                <h2 className="text-3xl font-bold text-center font-mono mb-2 text-white">
                  {gameState.currentPlanet.name}
                </h2>
                <p className="text-lg font-mono text-center mb-6 text-gray-300">
                  {gameState.currentPlanet.subject} Planet
                </p>
                
                <button 
                    className="w-full font-mono bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-lg transition-colors cursor-pointer"
                    onClick={() => console.log('Start questions for', gameState.currentPlanet?.subject)}
                  >
                    Start Learning Adventure
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}