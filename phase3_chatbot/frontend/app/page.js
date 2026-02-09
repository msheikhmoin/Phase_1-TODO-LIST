'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef(null);

  const API_URL = "https://moin-robo-todo-ai-backend.hf.space";

  useEffect(() => { setMounted(true); }, []);

  const fetchTasks = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch (e) { console.error(e); }
  }, [router]);

  useEffect(() => { if (mounted) fetchTasks(); }, [fetchTasks, mounted]);

  const handleSendMessage = async (msg) => {
    if (!msg.trim()) return;
    const token = localStorage.getItem('token');
    setMessages(p => [...p, { id: Date.now(), content: msg, role: "user" }]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(p => [...p, { id: Date.now()+1, content: data.message, role: "assistant" }]);
        fetchTasks();
      }
    } catch (e) { console.error(e); }
    finally { 
      setIsLoading(false); 
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-black">
      {/* Background Fix: Ensure green.jpg is in /public folder */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url('/green.jpg')" }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90"></div>

      <div className="relative z-10 flex h-full w-full">
        <Sidebar onLogout={() => { localStorage.removeItem('token'); router.push('/login'); }} />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white/5 backdrop-blur-md p-4 border-b border-white/10 flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-emerald-400">VIP Todo AI</h1>
            <Clock />
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-2xl max-w-[70%] ${m.role === 'user' ? 'bg-emerald-600' : 'bg-slate-800 border border-white/10'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-black/40 backdrop-blur-lg">
            <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>

        <div className="w-80 bg-black/20 border-l border-white/10 backdrop-blur-md overflow-y-auto p-4">
          <h2 className="text-emerald-400 font-bold mb-4">TASKS</h2>
          {tasks.map(t => <TaskCard key={t.id} task={t} onDelete={fetchTasks} />)}
        </div>
      </div>
    </div>
  );
}