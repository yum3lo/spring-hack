'use client';

import { useState } from 'react';
import Orb from '@/components/orb/Orb';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registering:', { username, email, dob, password });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden">
      <div style={{ width: '100%', height: '600px', position: 'relative' }}>
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={180}
          forceHoverState={false}
        />
      </div>

      <form
        onSubmit={handleRegister}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 p-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">
          Register
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full mb-4 p-2 border border-gray-600 rounded bg-transparent text-white placeholder-gray-400"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 p-2 border border-gray-600 rounded bg-transparent text-white placeholder-gray-400"
        />

        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
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
          Create Account
        </button>

        <div className="mt-4 text-center text-sm text-white">
          Already have an account?{' '}
          <a href="/auth/login" className="underline hover:text-blue-400">
            Log in
          </a>
        </div>
      </form>
    </div>
  );
}
