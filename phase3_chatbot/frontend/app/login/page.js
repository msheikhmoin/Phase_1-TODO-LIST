'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // 🔥 Added for Signup
  const [isSignup, setIsSignup] = useState(false); // 🔥 Toggle state
  const [error, setError] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setIsLoading(true);
    
    // 🔥 Determine endpoint based on mode
    const endpoint = isSignup ? 'signup' : 'login';
    const payload = isSignup ? { email, username, password } : { email, password };
    
    try {
      const res = await fetch(`https://moin-robo-todo-ai-backend.hf.space/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (isSignup) {
          alert("Account created! Now please Sign In.");
          setIsSignup(false); // Switch to login after signup
        } else {
          localStorage.setItem('token', data.access_token);
          window.location.href = '/'; 
        }
      } else {
        setError(data.detail || `Error during ${endpoint}`);
      }
    } catch (err) {
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
          <h1 className="text-2xl font-bold text-white">{isSignup ? "Create Account" : "Welcome Back"}</h1>
          <p className="text-slate-400 text-sm">{isSignup ? "Join us today" : "Sign in to your account"}</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm text-center">
            {String(error)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignup && (
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-[#2a2f45] p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-[#2a2f45] p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-[#2a2f45] p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all"
          >
            {isLoading ? "Processing..." : (isSignup ? "Sign Up" : "Sign In")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}