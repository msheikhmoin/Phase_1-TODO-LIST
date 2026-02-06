'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LifebuoyIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Sidebar } from '../../components/Sidebar';
import { TaskCard } from '../../components/TaskCard';
import dynamic from 'next/dynamic';

const Clock = dynamic(() => import('../../components/Clock'), {
  ssr: false
});

export default function SupportPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

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
  }, [router]);

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
              <LifebuoyIcon className="h-8 w-8 text-emerald-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                Support
              </h1>
            </div>
            <Clock />
          </div>
        </motion.header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Support Options Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-container p-6 rounded-2xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <LifebuoyIcon className="h-6 w-6 text-emerald-400" />
              <h2 className="text-xl font-semibold text-white">How can we help you?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 glass-container rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <h3 className="text-white font-medium mb-2">FAQ</h3>
                <p className="text-white/80 text-sm">Find answers to common questions</p>
              </div>
              <div className="p-4 glass-container rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <h3 className="text-white font-medium mb-2">Contact Us</h3>
                <p className="text-white/80 text-sm">Get in touch with our team</p>
              </div>
              <div className="p-4 glass-container rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <h3 className="text-white font-medium mb-2">Report Issue</h3>
                <p className="text-white/80 text-sm">Report a bug or technical issue</p>
              </div>
              <div className="p-4 glass-container rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <h3 className="text-white font-medium mb-2">Feature Request</h3>
                <p className="text-white/80 text-sm">Suggest a new feature</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Methods Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-container p-6 rounded-2xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <SparklesIcon className="h-6 w-6 text-emerald-400" />
              <h2 className="text-xl font-semibold text-white">Contact Methods</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 glass-container rounded-lg">
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path fillRule="evenodd" d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Email Support</span>
                </div>
                <span className="text-emerald-400 text-sm">support@viptodo.com</span>
              </div>

              <div className="flex items-center justify-between p-4 glass-container rounded-lg">
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Live Chat</span>
                </div>
                <span className="text-green-400 text-sm">Online</span>
              </div>

              <div className="flex items-center justify-between p-4 glass-container rounded-lg">
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-white">Phone Support</span>
                </div>
                <span className="text-emerald-400 text-sm">+1 (555) 123-4567</span>
              </div>
            </div>
          </motion.div>

          {/* Business Hours Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-container p-6 rounded-2xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <svg className="h-6 w-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <h2 className="text-xl font-semibold text-white">Business Hours</h2>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-white">Monday - Friday</span>
                <span className="text-white">9:00 AM - 6:00 PM EST</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-white">Saturday</span>
                <span className="text-white">10:00 AM - 4:00 PM EST</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-white">Sunday</span>
                <span className="text-emerald-400">Closed</span>
              </div>
            </div>
          </motion.div>
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
            <div className="text-center py-8 text-white/70">
              <p>No tasks yet!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}