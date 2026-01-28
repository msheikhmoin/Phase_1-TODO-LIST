'use client';

import { motion } from 'framer-motion';
import { UserIcon, BellIcon, CogIcon, ChartBarIcon, DocumentTextIcon, LifebuoyIcon } from '@heroicons/react/24/outline';

export const Sidebar = () => {
  const menuItems = [
    { icon: DocumentTextIcon, label: 'Dashboard', active: true },
    { icon: BellIcon, label: 'Notifications' },
    { icon: ChartBarIcon, label: 'Analytics' },
    { icon: CogIcon, label: 'Settings' },
    { icon: LifebuoyIcon, label: 'Support' },
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-64 glass-container border-r border-white/10 p-4 flex flex-col"
    >
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-gradient-start to-royal-blue rounded-xl flex items-center justify-center">
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

      {/* User Profile */}
      <div className="mt-auto pt-4 border-t border-white/10">
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