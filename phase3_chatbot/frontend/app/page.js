'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Sidebar } from '../components/Sidebar';
import { ChatInput } from '../components/ChatInput';
import { TaskCard } from '../components/TaskCard';
import dynamic from 'next/dynamic';

// Clock ko safety ke saath import kiya
const Clock = dynamic(() => import('../components/Clock'), { 
  ssr: false,
  loading: () => <span className="text-white/20 text-xs">...</span>
});

export default function Home() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false); // 🔥 Hydration Fix
  const messagesEndRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://moin-robo-todo-ai-backend.hf.space";

  // --- Hydration Check ---
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchTasks = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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
        // 🔥 Error #31 Fix: Check if data is actually an array
        setTasks(Array.isArray(data) ? data : []);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } catch (error) {
      console.error('Fetch tasks error:', error);
      setTasks([]);
    }
  }, [router, API_URL]);

  useEffect(() => {
    if (mounted) {
      fetchTasks();
    }
  }, [fetchTasks, mounted]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    const token = localStorage.getItem('token');

    setMessages(prev => [...prev, {
      id: Date.now(),
      content: String(message), 
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

      const data = await response.json();

      if (response.ok) {
        // 🔥 Error #31 Fix: Ensure we are not rendering an object
        const aiResponse = typeof data.response === 'string' ? data.response : 
                          (typeof data.message === 'string' ? data.message : "Task processed!");
        
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          content: aiResponse,
          role: "assistant",
          timestamp: new Date().toISOString()
        }]);

        if (data.tasks_created || data.refresh_tasks) {
          fetchTasks();
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  // Jab tak mount na ho, kuch render na karein (White page protection)
  if (!mounted) {
    return <div className="h-screen w-screen bg-slate-950 flex items-center justify-center text-white">Loading VIP Todo...</div>;
  }

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden fixed inset-0">
      <Sidebar onLogout={() => { localStorage.removeItem('token'); router.push('/login'); }} />

      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        <header className="bg-slate-900/50 backdrop-blur-md p-4 border-b border-white/10 flex items-center justify-between shrink-0 h-16">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
              VIP Todo AI
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMessages([])}
              className="px-3 py-1 text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
            >
              Clear
            </button>
            <Clock />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/20">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center">
               <SparklesIcon className="h-12 w-12 text-emerald-400 mb-4 opacity-50" />
               <p className="text-xl font-semibold text-white">AI Ready</p>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                m.role === 'user' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-800 border border-white/10 text-slate-100'
              } text-sm shadow-xl`}>
                {String(m.content)}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-slate-900/80 border-t border-white/10 shrink-0">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>

      <div className="w-80 bg-slate-900/40 border-l border-white/10 flex flex-col h-full backdrop-blur-sm">
        <div className="p-4 border-b border-white/10 shrink-0 bg-slate-900/60">
          <h2 className="text-white font-bold flex items-center text-xs tracking-widest uppercase">
            <CheckCircleIcon className="h-4 w-4 text-emerald-400 mr-2" /> Your Tasks
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {tasks.length > 0 ? (
            tasks.map((t) => (
              <TaskCard key={t.id || Math.random()} task={t} onDelete={fetchTasks} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 opacity-20">
              <p className="text-xs italic text-white">No active tasks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}