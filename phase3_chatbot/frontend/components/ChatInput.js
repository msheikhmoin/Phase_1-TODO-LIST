'use client';

import { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

export const ChatInput = ({ onSend, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSend(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-3">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your message... (e.g., 'Remind me to call the plumber at 5 PM tomorrow')"
        disabled={isLoading}
        className="flex-1 chat-input px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-primary"
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