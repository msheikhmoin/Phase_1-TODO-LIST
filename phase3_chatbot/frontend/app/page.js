'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Sidebar } from '../components/Sidebar';
import { ChatInput } from '../components/ChatInput';
import { TaskCard } from '../components/TaskCard';
import dynamic from 'next/dynamic';

const Clock = dynamic(() => import('../components/Clock'), { ssr: false });

export default function Home() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // --- API URL FIX (Removing the extra /api since your backend doesn't use it) ---
  const API_URL = "http://localhost:8000";

  const fetchTasks = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/tasks`, {
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
      console.error('Fetch tasks error:', error);
    }
  }, [router]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirect if token is null
      return;
    }
    console.log("Attempting delete at:", `${API_URL}/tasks/${taskId}`); // Added for debugging
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } // Added content-type header
      });
      if (res.ok) {
        fetchTasks();
      } else if (res.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        router.push('/login');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    const token = localStorage.getItem('token');

    setMessages(prev => [...prev, {
      id: Date.now(),
      content: message,
      role: "user",
      timestamp: new Date().toISOString()
    }]);

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Chat response data:", data); // Debug logging
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          content: data.message || "Task updated!",
          role: "assistant",
          timestamp: new Date().toISOString()
        }]);
        if (data.tasks_created && data.tasks_created.length > 0) {
          console.log("Tasks created, refreshing tasks list"); // Debug logging
          fetchTasks(); // This will immediately update the sidebar
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-transparent overflow-hidden fixed inset-0">
      <Sidebar onLogout={() => { localStorage.removeItem('token'); router.push('/login'); }} />

      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        <header className="glass-chat p-4 border-b border-white/10 flex items-center justify-between shrink-0 h-16">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
              VIP Todo AI Chatbot
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMessages([])}
              className="px-3 py-1 text-[10px] font-bold uppercase tracking-tighter bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
            >
              Clear Chat
            </button>
            <Clock />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/10">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-start justify-start pt-10 pl-4 text-white">
               <SparklesIcon className="h-12 w-12 mb-4 text-white/80" />
               <p className="text-lg font-semibold">Welcome to VIP Todo AI Chatbot!</p>
               <p className="text-white/80 mt-1">How can I assist you today?</p>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-emerald-600 shadow-lg shadow-emerald-900/20' : 'glass-chat border border-white/10'} text-white text-sm`}>
                {m.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-black/40 border-t border-white/10 shrink-0">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>

      <div className="w-80 bg-black/40 border-l border-white/10 flex flex-col h-full">
        <div className="p-4 border-b border-white/10 shrink-0">
          <h2 className="text-white font-bold flex items-center text-xs tracking-widest uppercase">
            <CheckCircleIcon className="h-4 w-4 text-emerald-400 mr-2" /> Your Tasks
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {tasks.length > 0 ? (
            tasks.map((t) => <TaskCard key={t.id} task={t} onDelete={handleDeleteTask} />)
          ) : (
            <p className="text-white/20 text-center mt-10 text-xs italic">No active tasks</p>
          )}
        </div>
      </div>
    </div>
  );
}