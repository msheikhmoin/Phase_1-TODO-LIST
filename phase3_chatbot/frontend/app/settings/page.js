'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CogIcon, UserIcon, BellIcon, KeyIcon, SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Sidebar } from '../../components/Sidebar';
import { TaskCard } from '../../components/TaskCard';
import dynamic from 'next/dynamic';

const Clock = dynamic(() => import('../../components/Clock'), {
  ssr: false
});

export default function SettingsPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
  });
  const [profileData, setProfileData] = useState({
    name: 'VIP User',
    email: 'vip@example.com',
    theme: 'aurora-green'
  });

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

  const handleNotificationToggle = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSaveProfile = () => {
    alert('Settings Saved!');
  };

  const handleExportData = () => {
    // Create a simple CSV content
    const csvContent = "data:text/csv;charset=utf-8," + "Setting,Value\nProfile Name," + profileData.name + "\nEmail," + profileData.email + "\nTheme," + profileData.theme + "\n";

    // Create a link element and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vip-todo-settings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen bg-transparent">
      <Sidebar onLogout={() => console.log('User logged out')} />

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

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Profile Settings Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-container p-6 rounded-2xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <UserIcon className="h-6 w-6 text-emerald-400" />
              <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full glass-container px-4 py-2 rounded-lg text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full glass-container px-4 py-2 rounded-lg text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-white mb-2">Theme</label>
              <select
                value={profileData.theme}
                onChange={(e) => setProfileData(prev => ({ ...prev, theme: e.target.value }))}
                className="w-full glass-container px-4 py-2 rounded-lg text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="aurora-green">Aurora/Green</option>
                <option value="dark-blue">Dark Blue</option>
                <option value="purple">Purple</option>
              </select>
            </div>

            <button
              onClick={handleSaveProfile}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300"
            >
              Save Profile
            </button>
          </motion.div>

          {/* Notification Toggles Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-container p-6 rounded-2xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <BellIcon className="h-6 w-6 text-emerald-400" />
              <h2 className="text-xl font-semibold text-white">Notification Toggles</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 glass-container rounded-lg">
                <div className="flex items-center space-x-3">
                  <BellIcon className="h-5 w-5 text-emerald-400" />
                  <span className="text-white">Email Notifications</span>
                </div>
                <button
                  onClick={() => handleNotificationToggle('email')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificationSettings.email ? 'bg-emerald-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationSettings.email ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 glass-container rounded-lg">
                <div className="flex items-center space-x-3">
                  <SparklesIcon className="h-5 w-5 text-emerald-400" />
                  <span className="text-white">Push Notifications</span>
                </div>
                <button
                  onClick={() => handleNotificationToggle('push')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificationSettings.push ? 'bg-emerald-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationSettings.push ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 glass-container rounded-lg">
                <div className="flex items-center space-x-3">
                  <KeyIcon className="h-5 w-5 text-emerald-400" />
                  <span className="text-white">SMS Alerts</span>
                </div>
                <button
                  onClick={() => handleNotificationToggle('sms')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificationSettings.sms ? 'bg-emerald-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationSettings.sms ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Account Preferences Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-container p-6 rounded-2xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <KeyIcon className="h-6 w-6 text-emerald-400" />
              <h2 className="text-xl font-semibold text-white">Account Preferences</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 glass-container rounded-lg">
                <h3 className="text-white font-medium mb-2">Language</h3>
                <select className="w-full glass-container px-4 py-2 rounded-lg text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>

              <div className="p-4 glass-container rounded-lg">
                <h3 className="text-white font-medium mb-2">Time Zone</h3>
                <select className="w-full glass-container px-4 py-2 rounded-lg text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                  <option>(GMT-05:00) Eastern Time</option>
                  <option>(GMT-08:00) Pacific Time</option>
                  <option>(GMT+00:00) UTC</option>
                </select>
              </div>

              <div className="p-4 glass-container rounded-lg">
                <h3 className="text-white font-medium mb-2">Data Export</h3>
                <p className="text-white/80 text-sm mb-3">Export your data in various formats</p>
                <button onClick={handleExportData} className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300">
                  Export Data
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}