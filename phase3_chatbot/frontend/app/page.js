'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon, SparklesIcon, CheckCircleIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import { ChatInput } from '@/components/ChatInput';
import { TaskCard } from '@/components/TaskCard';
import { Sidebar } from '@/components/Sidebar';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Welcome to VIP Todo AI! How can I help you today?",
      role: "assistant",
      timestamp: new Date().toISOString()
    }
  ]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      content: message,
      role: "user",
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simulate API call to backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock AI response with tasks
      const mockResponse = {
        message: `I've processed your request: "${message}".`,
        tasks_created: [
          {
            id: Date.now() + 1,
            title: message,
            description: `Task extracted from your message: ${message}`,
            category: message.toLowerCase().includes('car') ? 'Auto' : message.toLowerCase().includes('work') ? 'Work' : 'Personal',
            priority: message.toLowerCase().includes('urgent') || message.toLowerCase().includes('emergency') ? 'High' : 'Medium',
            completed: false,
            created_at: new Date().toISOString()
          }
        ]
      };

      // Add AI response
      const aiMessage = {
        id: Date.now() + 2,
        content: mockResponse.message,
        role: "assistant",
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Add tasks
      setTasks(prev => [...prev, ...mockResponse.tasks_created]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 2,
        content: "Sorry, I encountered an error processing your request.",
        role: "assistant",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-deep-dark via-dark-slate to-indigo-primary">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-container p-4 border-b border-white/10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SparklesIcon className="h-8 w-8 text-neon-accent" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-gradient-start to-royal-blue bg-clip-text text-transparent">
                VIP Todo AI
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <ClockIcon className="h-4 w-4" />
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </motion.header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-indigo-gradient-start to-indigo-gradient-end text-white ml-auto'
                  : 'glass-container text-white mr-auto'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-start"
            >
              <div className="glass-container px-4 py-3 rounded-2xl text-white mr-auto max-w-xs">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-neon-accent rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-neon-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-neon-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 glass-container border-t border-white/10">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>

      {/* Tasks Panel */}
      <div className="w-80 glass-container border-l border-white/10 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
          Your Tasks
        </h2>

        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No tasks yet!</p>
              <p className="text-sm mt-1">Send a message to create tasks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}