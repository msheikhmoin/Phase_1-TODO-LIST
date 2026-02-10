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

  // ✅ Fetch tasks safely
  const fetchTasks = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    try {
      const res = await fetch(`${API_URL}/tasks`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Tasks Fetch Error:", e);
    }
  }, [router]);

  useEffect(() => { if (mounted) fetchTasks(); }, [fetchTasks, mounted]);

  // ✅ Handle chat messages
  const handleSendMessage = async (msg) => {
    if (!msg.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Session expired. Please login again.");
      return router.push('/login');
    }

    const userMsgId = Date.now();
    setMessages(p => [...p, { id: userMsgId, content: msg, role: "user" }]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessages(p => [...p, { id: Date.now() + 1, content: data.message, role: "assistant" }]);
        setTimeout(() => fetchTasks(), 1000);
      } else {
        const errorMsg = data.detail || "Something went wrong.";
        setMessages(p => [...p, { id: Date.now() + 1, content: `Error: ${errorMsg}`, role: "assistant" }]);
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
      {/* Background overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40" style={{ backgroundImage: "url('/green.jpg')" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90"></div>

      <div className="relative z-10 flex h-full w-full">
        <Sidebar onLogout={() => { localStorage.removeItem('token'); router.push('/login'); }} />

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
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-black/40 backdrop-blur-lg border-t border-white/5">
            <ChatInput onSend={handleSendMessage} />
          </div>
        </div>

        <div className="w-80 bg-black/40 border-l border-white/10 backdrop-blur-md overflow-y-auto p-4 hidden lg:block">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xl">✅</span>
            <h2 className="text-emerald-400 font-bold text-lg tracking-widest">MY TASKS</h2>
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
