'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const backendUrl = 'https://moin-robo-todo-ai-backend.hf.space'; // ✅ Hugging Face backend

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created! Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(data.detail || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Create Account</h1>
        {error && <div className="mb-4 p-3 bg-red-500/20 text-red-200 text-sm rounded">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-500/20 text-green-200 text-sm rounded">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white" />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white" />
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
