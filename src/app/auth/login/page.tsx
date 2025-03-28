'use client';

import { useState } from 'react';
import Orb from '@/components/orb/Orb'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in:', { email, password });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden">
      <div style={{ width: '100%', height: '600px', position: 'relative' }}>
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>

      <form
  onSubmit={handleLogin}
  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 p-8 w-full max-w-sm"
>
  <h2 className="text-2xl font-semibold mb-6 text-center text-white">
    Login
  </h2>

  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    className="w-full mb-4 p-2 border border-gray-600 rounded bg-transparent text-white placeholder-gray-400"
  />

  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    className="w-full mb-6 p-2 border border-gray-600 rounded bg-transparent text-white placeholder-gray-400"
  />

  <button
    type="submit"
    className="w-full bg-purple-600 text-white font-semibold py-2 px-4 rounded hover:bg-purple-700 transition duration-200"
  >
    Log In
  </button>

  <div className="mt-4 text-center text-sm text-white">
    Don’t have an account?{' '}
    <a href="/auth/register" className="underline hover:text-blue-400">
      Sign up
    </a>
  </div>
</form>

    </div>
  );
}
