'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const backendUrl = 'https://moin-robo-todo-ai-backend.hf.space';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${backendUrl}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (res.ok) {
        setSuccess('Account created! Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        const data = await res.json();
        setError(data.detail || 'Registration failed');
      }
    } catch (err) { setError('Connection failed.'); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-[#1e2235] text-white">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        {error && <div className="mb-4 p-3 bg-red-500/10 text-red-400 rounded text-center">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-500/10 text-green-400 rounded text-center">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full p-4 bg-[#2a2f45] rounded-xl outline-none" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-4 bg-[#2a2f45] rounded-xl outline-none" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-4 bg-[#2a2f45] rounded-xl outline-none" />
          <button type="submit" className="w-full bg-indigo-600 py-4 rounded-xl hover:bg-indigo-700 transition font-bold">Sign Up</button>
        </form>
      </div>
    </div>
  );
}