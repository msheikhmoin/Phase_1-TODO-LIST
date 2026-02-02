'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon, CogIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Sidebar } from '../../components/Sidebar';
import { ChatInput } from '../../components/ChatInput';
import { TaskCard } from '../../components/TaskCard';
import dynamic from 'next/dynamic';

const Clock = dynamic(() => import('../../components/Clock'), {
  ssr: false
});

export default function SettingsPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Welcome to the Settings page! Here you can customize your VIP Todo AI experience.",
      role: "assistant",
      timestamp: new Date().toISOString()
    }
  ]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
    scrollToBottom();
  }, [router]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userMessage = {
      id: Date.now(),
      content: message,
      role: "user",
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage = {
          id: Date.now() + 1,
          content: data.response || data.message || `I've processed your request: "${message}".`,
          role: "assistant",
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMessage]);
        if (data.tasks_created && Array.isArray(data.tasks_created)) {
          setTasks(prev => [...prev, ...data.tasks_created]);
        }
      } else {
        const errorData = await response.json();
        const errorMessage = {
          id: Date.now() + 1,
          content: errorData.detail || "Sorry, I encountered an error.",
          role: "assistant",
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleLogout = async () => {
    console.log('User logged out');
  };

  return (
    <div className="flex h-screen bg-transparent">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-chat p-4 border-b border-white/10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CogIcon className="h-8 w-8 text-emerald-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                Settings
              </h1>
            </div>
            <Clock />
          </div>
        </motion.header>

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
                  ? 'bg-blue-600 text-white ml-auto'
                  : 'glass-chat text-white mr-auto border border-white/10'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="glass-chat px-4 py-3 rounded-2xl text-white">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 glass-chat border-t border-white/10">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>

      <div className="w-80 glass-tasks border-l border-white/10 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <SparklesIcon className="h-5 w-5 text-green-400 mr-2" />
          Your Tasks
        </h2>
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No tasks yet!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}