'use client';
import { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

export const ChatInput = ({ onSend, disabled }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || disabled) return;
    
    // Sirf Page.js ko message bhejdo, wo khud backend sambhal lega
    onSend(inputValue);
    setInputValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-3">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={disabled ? "AI is thinking..." : "Type your message..."}
        disabled={disabled}
        className="flex-1 chat-input px-4 py-3 rounded-xl text-slate-900 placeholder-gray-500 bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <button
        type="submit"
        disabled={disabled || !inputValue.trim()}
        className={`glow-button p-3 rounded-xl flex items-center justify-center transition-all duration-300 ${
          disabled || !inputValue.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-neon bg-emerald-600'
        }`}
      >
        <PaperAirplaneIcon className="h-5 w-5 text-white" />
      </button>
    </form>
  );
};