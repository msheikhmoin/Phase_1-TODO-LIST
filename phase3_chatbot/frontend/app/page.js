'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Sidebar } from '../components/Sidebar';
import { ChatInput } from '../components/ChatInput';
import { TaskCard } from '../components/TaskCard';
import dynamic from 'next/dynamic';

const Clock = dynamic(() => import('../components/Clock'), { 
  ssr: false,
  loading: () => <span className="text-white/20 text-xs">...</span>
});

export default function Home() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false); 
  const messagesEndRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://moin-robo-todo-ai-backend.hf.space";

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
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Fetch tasks error:', error);
    }
  }, [router, API_URL]);

  useEffect(() => {
    if (mounted) fetchTasks();
  }, [fetchTasks, mounted]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    const token = localStorage.getItem('token');

    setMessages(prev => [...prev, { id: Date.now(), content: String(message), role: "user" }]);
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
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          content: data.message || "Task Updated!",
          role: "assistant"
        }]);
        fetchTasks(); // Task list refresh karein
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  if (!mounted) return null;

  return (
    // 🔥 IMAGE FIX: green.jpg applied here
    <div className="fixed inset-0 h-screen w-screen overflow-hidden">
      {/* Background Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{ backgroundImage: "url('/green.jpg')" }}
      />
      
      {/* Dark Overlay - Taake content saaf nazar aaye */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]"></div>

      {/* Main Content Layer */}
      <div className="relative z-10 flex h-full w-full">
        <Sidebar onLogout={() => { localStorage.removeItem('token'); router.push('/login'); }} />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-black/20 backdrop-blur-xl p-4 border-b border-white/10 flex items-center justify-between shrink-0 h-16">
            <div className="flex items-center space-x-3">
              <SparklesIcon className="h-6 w-6 text-emerald-400" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                VIP Todo AI
              </h1>
            </div>
            <Clock />
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-30">
                 <SparklesIcon className="h-12 w-12 text-emerald-400 mb-2" />
                 <p className="text-white font-medium">Chat with AI to manage tasks</p>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] p-4 rounded-2xl shadow-lg ${
                  m.role === 'user' ? 'bg-emerald-600/90 text-white' : 'bg-slate-800/90 border border-white/10 text-slate-100'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-black/40 backdrop-blur-md border-t border-white/10">
            <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>

        {/* Right Task Sidebar */}
        <div className="w-80 bg-black/30 border-l border-white/10 flex flex-col h-full backdrop-blur-md">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-white font-bold flex items-center text-xs tracking-widest uppercase">
              <CheckCircleIcon className="h-4 w-4 text-emerald-400 mr-2" /> Live Tasks
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {tasks.length > 0 ? (
              tasks.map((t) => (
                <TaskCard key={t.id} task={t} onDelete={fetchTasks} />
              ))
            ) : (
              <div className="text-center mt-10 opacity-20 italic text-white text-xs">No tasks found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}