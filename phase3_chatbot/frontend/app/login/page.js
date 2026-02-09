'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); 
    setIsLoading(true);
    
    try {
      // 1. Pehle JSON format try karein (Jo modern FastAPI mein hota hai)
      const res = await fetch(`https://moin-robo-todo-ai-backend.hf.space/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.access_token);
        window.location.href = '/'; // Hard redirect to dashboard
      } else {
        // Agar 500 error hai toh uska matlab backend code mein bug hai
        if (res.status === 500) {
          setError("Backend Server phat gaya hai (500 Error). Please check backend logs.");
        } else {
          setError(data.detail || "Invalid email or password");
        }
      }
    } catch (err) {
      // Agar fetch hi na ho paye (CORS ya network issue)
      setError("Server connection failed. Is backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-[#1e2235] p-8 rounded-3xl w-full max-w-md shadow-2xl border border-white/5">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4">V</div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm text-center">
            {String(error)}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400 ml-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-[#2a2f45] border-none p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-[#2a2f45] border-none p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all mt-4"
          >
            {isLoading ? "Processing..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account? <a href="/signup" className="text-blue-500 font-medium">Sign up</a>
        </p>
      </div>
    </div>
  );
}