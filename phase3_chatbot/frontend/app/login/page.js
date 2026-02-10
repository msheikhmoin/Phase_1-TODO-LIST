'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const backendUrl = 'https://moin-robo-todo-ai-backend.hf.space';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const endpoint = isSignup ? 'signup' : 'login';
    const payload = isSignup
      ? { email, username: email.split('@')[0], password } // default username
      : { email, password };

    try {
      const res = await fetch(`${backendUrl}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (isSignup) {
          alert("Signup successful! Please Sign In.");
          setIsSignup(false);
        } else {
          localStorage.setItem('token', data.access_token);
          router.push('/');
        }
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
      <div className="bg-[#1e2235] p-8 rounded-3xl w-full max-w-md shadow-2xl border border-white/5">
        <h1 className="text-2xl font-bold text-white text-center mb-2">{isSignup ? "Join Us" : "Welcome Back"}</h1>
        <p className="text-slate-400 text-center mb-8 text-sm">{isSignup ? "Create your account" : "Sign in to continue"}</p>

        {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-xl mb-4 text-xs text-center border border-red-500/20">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input type="text" placeholder="Username" className="w-full bg-[#2a2f45] p-4 rounded-xl text-white outline-none" value={email.split('@')[0]} disabled />
          )}
          <input type="email" placeholder="Email" className="w-full bg-[#2a2f45] p-4 rounded-xl text-white outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full bg-[#2a2f45] p-4 rounded-xl text-white outline-none" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all">
            {isLoading ? "Wait..." : (isSignup ? "Sign Up" : "Sign In")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsSignup(!isSignup)} className="text-blue-400 hover:text-blue-300 text-sm">
            {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
