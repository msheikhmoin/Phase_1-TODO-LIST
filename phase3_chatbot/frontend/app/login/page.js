'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Ismein hum sirf string rakhein ge
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); 
    
    try {
      const res = await fetch(`https://moin-robo-todo-ai-backend.hf.space/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password: password }), // Backend 'username' mangta hai ya 'email'? Check karein.
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.access_token);
        router.push('/');
      } else {
        // 🔥 CRASH FIX: Agar data.detail koi object ya array hai, toh usay string mein badlein
        const errorMsg = typeof data.detail === 'object' 
          ? JSON.stringify(data.detail) 
          : (data.detail || "Login failed");
        setError(String(errorMsg)); 
      }
    } catch (err) {
      setError("Server connection failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h1>
        
        {/* Error Alert - Safe Rendering */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-slate-800 border border-white/10 p-3 rounded-lg text-white outline-none focus:border-emerald-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-slate-800 border border-white/10 p-3 rounded-lg text-white outline-none focus:border-emerald-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-colors">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}