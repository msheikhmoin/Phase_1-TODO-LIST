'use client';

import { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

export default function Clock() {
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateTime = () => {
      setTime(new Date().toLocaleTimeString());
    };

    updateTime(); // Set initial time

    const interval = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-300">
      <ClockIcon className="h-4 w-4" />
      <span>{time}</span>
    </div>
  );
}