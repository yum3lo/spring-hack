'use client';

import { useState } from 'react';
import Orb from '@/components/orb/Orb';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error('Registration failed');
      }
  
      const data = await response.json();
      const token = data.token || data.accessToken || data;
  
      console.log(' Registered! Token:', token);
  
      localStorage.setItem('token', token);
  
      router.push('/auth/login');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try a different username.');
    }
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
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-6 p-2 border border-gray-600 rounded bg-transparent text-white placeholder-gray-400"
        />

        <button
          type="submit"
          className="w-full bg-green-700 text-white font-semibold py-2 px-4 rounded hover:bg-green-800 transition duration-200"
        >
          Create Account
        </button>

        <div className="mt-4 text-center text-sm text-white">
          Already have an account?{' '}
          <a href="/auth/login" className="underline hover:text-green-600">
            Log in
          </a>
        </div>
      </form>
    </div>
  );
}
