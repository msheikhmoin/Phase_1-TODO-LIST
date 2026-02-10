'use client';

import { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

export const ChatInput = ({ onSend }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const backendUrl = 'https://moin-robo-todo-ai-backend.hf.space'; // ✅ Hugging Face backend

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: inputValue }),
      });

      const data = await res.json();

      if (res.ok) {
        onSend(data.message); // Send AI response to parent component
        setInputValue('');
      } else {
        console.error('Error from backend:', data.detail || 'Unknown error');
        alert(data.detail || 'Backend error');
      }
    } catch (err) {
      console.error('Connection failed:', err);
      alert('Failed to connect to backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-3">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your message... (e.g., 'Remind me to buy milk tomorrow')"
        disabled={isLoading}
        className="flex-1 chat-input px-4 py-3 rounded-xl text-slate-900 placeholder-gray-500 bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <button
        type="submit"
        disabled={isLoading || !inputValue.trim()}
        className={`glow-button p-3 rounded-xl flex items-center justify-center transition-all duration-300 ${
          isLoading || !inputValue.trim()
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:scale-105 hover:shadow-neon'
        }`}
      >
        <PaperAirplaneIcon className="h-5 w-5 text-white" />
      </button>
    </form>
  );
};
