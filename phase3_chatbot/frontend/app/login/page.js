'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Agar pehle se login hai toh seedha dashboard pe bhejo
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) router.push('/');
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); 
    setIsLoading(true);
    
    try {
      // API URL setup
      const apiUrl = "https://moin-robo-todo-ai-backend.hf.space/auth/login";

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        // 🔥 FIXED: Backend expects 'email', not 'username'
        body: JSON.stringify({ 
          email: email, 
          password: password 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Token save karein aur redirect karein
        localStorage.setItem('token', data.access_token);
        router.push('/');
      } else {
        // Validation errors ko handle karein taake React crash na ho
        let errorMsg = "Login failed";
        
        if (typeof data.detail === 'string') {
          errorMsg = data.detail;
        } else if (Array.isArray(data.detail)) {
          // Agar backend validation error (422) bhej raha hai
          errorMsg = data.detail[0]?.msg || "Invalid data format";
        } else if (typeof data.detail === 'object') {
          errorMsg = JSON.stringify(data.detail);
        }
        
        setError(errorMsg); 
      }
    } catch (err) {
      setError("Server connection failed. Is backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Sign in to your account</p>
        </div>
        
        {/* Error Message Box */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full bg-slate-800 border border-white/10 p-3 rounded-lg text-white outline-none focus:border-emerald-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-slate-800 border border-white/10 p-3 rounded-lg text-white outline-none focus:border-emerald-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-emerald-900/20"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            Don't have an account? <a href="/signup" className="text-emerald-500 hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}