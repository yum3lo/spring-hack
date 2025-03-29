export type Position = { x: number; y: number };

export type Planet = {
  id: string;
  name: string;
  subject: string;
  color: string;
  image: string;
  connections: string[];
  position: Position;
  size: number;
  glowColor: string;
  bg: string;
  alien: string;
};

export type PlanetsData = {
  planets: Planet[];
  connections: { from: string; to: string }[];
};