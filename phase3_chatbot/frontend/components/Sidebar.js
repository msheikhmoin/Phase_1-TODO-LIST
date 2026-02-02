'use client';

import { motion } from 'framer-motion';
import { UserIcon, BellIcon, CogIcon, ChartBarIcon, DocumentTextIcon, LifebuoyIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export const Sidebar = ({ onLogout }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const menuItems = [
    { icon: DocumentTextIcon, label: 'Dashboard', active: true, path: '/' },
    { icon: BellIcon, label: 'Notifications', path: '/notifications' },
    { icon: ChartBarIcon, label: 'Analytics', path: '/analytics' },
    { icon: CogIcon, label: 'Settings', path: '/settings' },
    { icon: LifebuoyIcon, label: 'Support', path: '/support' },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Remove token from localStorage
      localStorage.removeItem('token');

      // Call the parent component's logout handler if provided
      if (onLogout) {
        await onLogout();
      }

      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-64 glass-sidebar p-4 flex flex-col"
    >
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">VIP Todo</h2>
            <p className="text-xs text-gray-400">AI Assistant</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(item.path);
                }}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                  item.active
                    ? 'bg-gradient-to-r from-indigo-gradient-start/20 to-royal-blue/20 text-white shadow-glow'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </a>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="pt-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full logout-button text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300 bg-transparent border border-white/20 backdrop-blur-sm"
        >
          <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
          <span className="text-sm font-medium">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>

      {/* User Profile */}
      <div className="mt-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-neon-accent to-indigo-primary rounded-full flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">VIP User</p>
            <p className="text-xs text-gray-400">Online</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};