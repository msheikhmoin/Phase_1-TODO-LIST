'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BellIcon, SparklesIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Sidebar } from '../../components/Sidebar';
import { TaskCard } from '../../components/TaskCard';
import dynamic from 'next/dynamic';

const Clock = dynamic(() => import('../../components/Clock'), {
  ssr: false
});

export default function NotificationsPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'task',
      title: 'New Task Assigned',
      message: 'You have been assigned a new task: "Complete project proposal"',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false
    },
    {
      id: 2,
      type: 'system',
      title: 'System Update',
      message: 'VIP Todo AI has been updated to version 2.1.0 with new features',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true
    },
    {
      id: 3,
      type: 'alert',
      title: 'Deadline Alert',
      message: 'Task "Submit quarterly report" is due in 2 days',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      read: false
    },
    {
      id: 4,
      type: 'info',
      title: 'Meeting Reminder',
      message: 'Team meeting scheduled for tomorrow at 10:00 AM',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      read: true
    },
    {
      id: 5,
      type: 'task',
      title: 'Task Completed',
      message: 'Great job! You completed "Review design documents"',
      timestamp: new Date(Date.now() - 604800000).toISOString(),
      read: true
    }
  ]);

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

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task':
        return <CheckCircleIcon className="h-5 w-5 text-emerald-400" />;
      case 'alert':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />;
      case 'system':
        return <InformationCircleIcon className="h-5 w-5 text-blue-400" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-cyan-400" />;
      default:
        return <BellIcon className="h-5 w-5 text-white/70" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'task':
        return 'border-l-emerald-500';
      case 'alert':
        return 'border-l-yellow-500';
      case 'system':
        return 'border-l-blue-500';
      case 'info':
        return 'border-l-cyan-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
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
              <BellIcon className="h-8 w-8 text-emerald-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                Notifications
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={markAllAsRead}
                className="px-3 py-1 text-sm bg-emerald-600/20 hover:bg-emerald-600/30 text-white rounded-lg border border-emerald-600/30 transition-colors"
              >
                Mark All Read
              </button>
              <Clock />
            </div>
          </div>
        </motion.header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`task-card glass-container p-4 rounded-xl border-l-4 ${getNotificationColor(notification.type)} hover:shadow-glow transition-all duration-300 ${
                  !notification.read ? 'bg-white/5' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white text-sm">{notification.title}</h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-white/80 text-sm mt-1">{notification.message}</p>
                      <p className="text-xs text-white/60 mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="ml-2 text-xs text-white/60 hover:text-white transition-colors"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            {notifications.length === 0 && (
              <div className="text-center py-12">
                <BellIcon className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                <p className="text-white text-lg">No notifications yet</p>
                <p className="text-white/60 text-sm">You'll see important updates here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-80 glass-tasks border-l border-white/10 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
          Your Tasks
        </h2>
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-white/60">
              <p>No tasks yet!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}