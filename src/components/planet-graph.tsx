'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Planet, PlanetsData } from '../types/planets';

type PlanetGraphProps = {
  onPlanetSelect: (planet: Planet) => void;
  availablePlanets: Planet[];
  lastVisitedPlanet: Planet | null;
};

const planetsData = require('../data/planets.json');

export default function PlanetGraph({ 
  onPlanetSelect, 
  availablePlanets,
  lastVisitedPlanet 
}: PlanetGraphProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

  return (
    <div className="relative w-full h-[80vh] bg-space-bg">
      <svg className="absolute w-full h-full">
        {planetsData.connections.map((conn: any, index: number) => {
          const fromPlanet = planetsData.planets.find((p: Planet) => p.id === conn.from);
          const toPlanet = planetsData.planets.find((p: Planet) => p.id === conn.to);
          
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

      {planetsData.planets.map((planet: Planet) => {
        const isAvailable = availablePlanets.some(p => p.id === planet.id);
        const isLastVisited = lastVisitedPlanet?.id === planet.id;
        
        return (
          <div
            key={planet.id}
            className={`absolute flex flex-col items-center transition-all duration-300 ${
              isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
            } ${
              isLastVisited ? 'shadow-[0_0_15px_5px_rgba(255,255,255,0.3)]' : ''
            }`}
            style={{
              left: `${planet.position.x}%`,
              top: `${planet.position.y}%`,
              transform: hoveredPlanet === planet.id 
                ? 'translate(-50%, -50%) scale(1.2)' 
                : 'translate(-50%, -50%)'
            }}
            onMouseEnter={() => isAvailable && setHoveredPlanet(planet.id)}
            onMouseLeave={() => setHoveredPlanet(null)}
            onClick={() => isAvailable && onPlanetSelect(planet)}
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
        );
      })}
    </div>
  );
}