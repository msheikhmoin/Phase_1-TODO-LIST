'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Sidebar } from '../components/Sidebar';
import { ChatInput } from '../components/ChatInput';
import { TaskCard } from '../components/TaskCard';

const Clock = dynamic(() => import('../components/Clock'), { ssr: false });

export default function Home() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  const API_URL = "https://moin-robo-todo-ai-backend.hf.space";

  useEffect(() => setMounted(true), []);

  const fetchTasks = useCallback(async () => {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id'); // Backend se user_id bhi lena hai
    if (!token) return router.push('/login');
    try {
      // User specific tasks fetch karein
      const res = await fetch(`${API_URL}/tasks/${user_id}`, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Tasks Fetch Error:", e);
    }
  }, [router]);

  useEffect(() => { if (mounted) fetchTasks(); }, [fetchTasks, mounted]);

  const handleSendMessage = async (msg) => {
    if (!msg.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    // 1. Pehle user ka message screen par dikhao
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
        // 2. AI ka jawab screen par dikhao
        const aiMsg = data.response || data.message;
        setMessages(p => [...p, { id: Date.now() + 1, content: aiMsg, role: "assistant" }]);
        
        // Agar task add hua hai toh tasks refresh karo
        setTimeout(() => fetchTasks(), 1500);
      } else {
        setMessages(p => [...p, { id: Date.now() + 1, content: "Error: Could not get response", role: "assistant" }]);
      }
    } catch (e) {
      setMessages(p => [...p, { id: Date.now() + 1, content: "Network error.", role: "assistant" }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40" style={{ backgroundImage: "url('/green.jpg')" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90"></div>
      <div className="relative z-10 flex h-full w-full">
        <Sidebar onLogout={() => { localStorage.clear(); router.push('/login'); }} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white/5 backdrop-blur-md p-4 border-b border-white/10 flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-emerald-400">VIP Todo AI</h1>
            <Clock />
          </header>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 mt-20">
                <span className="text-5xl block mb-4">✨</span>
                <p>Ask me to save a task or just say Hi!</p>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-2xl max-w-[70%] shadow-lg ${m.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-800 border border-white/10 text-emerald-50'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-emerald-400 animate-pulse">Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 bg-black/40 backdrop-blur-lg border-t border-white/5">
            <ChatInput onSend={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
        <div className="w-80 bg-black/40 border-l border-white/10 backdrop-blur-md overflow-y-auto p-4 hidden lg:block">
          <div className="flex items-center gap-2 mb-6 text-emerald-400 font-bold tracking-widest uppercase">
            <span>✅</span> MY TASKS
          </div>
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-slate-500 text-sm text-center italic">No tasks yet.</p>
            ) : (
              tasks.map(t => <TaskCard key={t.id} task={t} onDelete={fetchTasks} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}