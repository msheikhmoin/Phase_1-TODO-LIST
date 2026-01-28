'use client';

import { motion } from 'framer-motion';
import { CheckCircleIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline';

export const TaskCard = ({ task }) => {
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'from-red-500 to-red-600';
      case 'medium':
        return 'from-yellow-500 to-yellow-600';
      case 'low':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'work':
        return 'text-blue-400';
      case 'personal':
        return 'text-purple-400';
      case 'health':
        return 'text-pink-400';
      case 'auto':
        return 'text-indigo-400';
      case 'home':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="task-card glass-container p-4 rounded-xl border-l-4 hover:shadow-glow transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-white text-sm">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getPriorityColor(task.priority)} text-white`}>
          {task.priority}
        </span>
      </div>

      <p className="text-gray-300 text-xs mb-3 line-clamp-2">{task.description}</p>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1">
          <TagIcon className="h-3 w-3 text-gray-400" />
          <span className={getCategoryColor(task.category)}>
            {task.category}
          </span>
        </div>

        <div className="flex items-center space-x-1 text-gray-400">
          <ClockIcon className="h-3 w-3" />
          <span>
            {new Date(task.created_at || task.createdAt || Date.now()).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};