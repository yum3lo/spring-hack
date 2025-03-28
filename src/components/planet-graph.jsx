'use client';

import { useState } from 'react';
import Image from 'next/image';
import planetsData from '../data/planets.json';

export default function PlanetGraph({ onPlanetSelect }) {
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  
  return (
    <div className="relative w-full h-[80vh] bg-space-bg">
      <svg className="absolute w-full h-full">
        {planetsData.connections.map((conn, index) => {
          const fromPlanet = planetsData.planets.find(p => p.id === conn.from);
          const toPlanet = planetsData.planets.find(p => p.id === conn.to);
          return (
            <line
              key={index}
              x1={`${fromPlanet.position.x}%`}
              y1={`${fromPlanet.position.y}%`}
              x2={`${toPlanet.position.x}%`}
              y2={`${toPlanet.position.y}%`}
              stroke={fromPlanet.color}
              strokeWidth="2"
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
              height: `${planet.size}px`,
              backgroundColor: planet.color
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
          <span className="mt-2 text-white font-medium text-sm">
            {planet.name}
          </span>
        </div>
      ))}
    </div>
  );
}