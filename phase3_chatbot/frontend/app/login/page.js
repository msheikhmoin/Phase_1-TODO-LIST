'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const backendUrl = 'https://moin-robo-todo-ai-backend.hf.space';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('username', data.username);
        router.push('/');
      } else {
        setError(data.detail || "Invalid credentials");
      }
    } catch (err) {
      setError("Backend connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-[#1e2235] p-8 rounded-3xl w-full max-w-md shadow-2xl border border-white/5 text-white">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
        {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-xl mb-4 text-xs text-center border border-red-500/20">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full bg-[#2a2f45] p-4 rounded-xl outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full bg-[#2a2f45] p-4 rounded-xl outline-none" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-4 rounded-xl transition-all">
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account? <button onClick={() => router.push('/signup')} className="text-blue-400">Sign Up</button>
        </p>
      </div>
    </div>
  );
}