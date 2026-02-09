'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Agar pehle se token hai toh home pe bhejo
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) router.push('/');
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Manual fallback URL agar env variable na miley
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://moin-robo-todo-ai-backend.hf.space";
      console.log("Attempting login to:", apiUrl);

      // PHASE 3 FIX: FastAPI OAuth2 expects Form Data
      const formData = new URLSearchParams();
      formData.append('username', email); 
      formData.append('password', password);

      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const data = await res.json();
      console.log("Response received:", data);

      if (res.ok) {
        localStorage.setItem('token', data.access_token);
        console.log("Login Success! Token saved.");
        router.push('/'); 
      } else {
        setError(data.detail || 'Login failed. Check your credentials.');
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError('Server connection error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
        <h1 className="text-2xl font-bold text-white text-center mb-8">Welcome Back</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-all disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          New here? <Link href="/signup" className="text-indigo-400 hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
}