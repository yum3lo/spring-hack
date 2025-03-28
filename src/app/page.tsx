
'use client';

import GameContainer from '@/components/game-container';
import Link from 'next/link';
import Orb from "@/components/orb/Orb"

export default function HomePage() {
  return (
<main className="relative h-screen w-full overflow-hidden">
      <GameContainer />
    </main>
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center text-white px-4"
      style={{ backgroundImage: 'url("/bkg.png")' }}
    >
      <div style={{ width: '100%', height: '600px', position: 'relative' }}>
              <Orb
                hoverIntensity={0.8}
                rotateOnHover={true}
                hue={360}
                forceHoverState={false}
              />
            </div>
            <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4">
  <div className="text-4xl font-medium text-center w-full margin">To get on board of QueShip, please:</div>
  
  <div className="flex gap-4 w-full justify-center">
    <Link
      href="/auth/register"
      className="px-8 py-3 text-lg font-medium text-white bg-transparent border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors duration-300 w-48 text-center"
    >
      Register
    </Link>
    <Link
      href="/auth/login"
      className="px-8 py-3 text-lg font-medium text-white bg-purple-700 hover:bg-purple-800 transition-colors duration-300 rounded-lg w-48 text-center"
    >
      Login
    </Link>
  </div>
</div>
      </div>

  );
}