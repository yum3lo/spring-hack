'use client';

import { useState } from 'react';
import Image from 'next/image';

// Define types for your planet data
type PlanetPosition = {
  x: number;
  y: number;
};

interface PlanetGraphProps {
  onPlanetSelect: (planet: Planet) => void;
  visitedPlanets: string[]; // Add this line
}

type Planet = {
  id: string;
  name: string;
  subject: string;
  color: string;
  image: string;
  connections: string[];
  position: PlanetPosition;
  size: number;
  glowColor: string;
};

type PlanetConnection = {
  from: string;
  to: string;
};

type PlanetsData = {
  planets: Planet[];
  connections: PlanetConnection[];
};

// Import with type assertion
const planetsData: PlanetsData = require('../data/planets.json');

// Define props type
interface PlanetGraphProps {
  onPlanetSelect: (planet: Planet) => void;
}

export default function PlanetGraph({ onPlanetSelect }: PlanetGraphProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  
  return (
    <div className="relative w-full h-[80vh] bg-space-bg">
      <svg className="absolute w-full h-full">
        {planetsData.connections.map((conn, index) => {
          const fromPlanet = planetsData.planets.find(p => p.id === conn.from);
          const toPlanet = planetsData.planets.find(p => p.id === conn.to);
          
          if (!fromPlanet || !toPlanet) return null;
          
          return (
            <line
              key={index}
              x1={`${fromPlanet.position.x}%`}
              y1={`${fromPlanet.position.y}%`}
              x2={`${toPlanet.position.x}%`}
              y2={`${toPlanet.position.y}%`}
              stroke={fromPlanet.color}
              strokeWidth="4"
              strokeOpacity="0.3"
            />
          );
        })}
      </svg>

      {planetsData.planets.map(planet => (
        <div
          key={planet.id}
          className="absolute flex flex-col items-center transition-all duration-300 cursor-pointer"
          style={{
            left: `${planet.position.x}%`,
            top: `${planet.position.y}%`,
            transform: hoveredPlanet === planet.id 
              ? 'translate(-50%, -50%) scale(1.2)' 
              : 'translate(-50%, -50%)',
            filter: hoveredPlanet === planet.id 
              ? `drop-shadow(0 0 8px ${planet.glowColor})`
              : `drop-shadow(0 0 4px ${planet.glowColor})`
          }}
          onMouseEnter={() => setHoveredPlanet(planet.id)}
          onMouseLeave={() => setHoveredPlanet(null)}
          onClick={() => onPlanetSelect(planet)}
        >
          <div 
            className="rounded-full transition-all duration-300"
            style={{
              width: `${planet.size}px`,
              height: `${planet.size}px`
            }}
          >
            <Image
              src={planet.image}
              alt={planet.name}
              width={planet.size}
              height={planet.size}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-white text-lg font-mono">
            {planet.name}
          </span>
        </div>
      ))}
    </div>
  );
}