'use client';

import { useState, useEffect } from 'react';

export function useRelativeTime(timestamp: number) {
  const [relativeTime, setRelativeTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const seconds = Math.floor((Date.now() - timestamp) / 1000);
      
      if (seconds < 60) {
        setRelativeTime('Just now');
      } else if (seconds < 3600) {
        setRelativeTime(`${Math.floor(seconds / 60)}m ago`);
      } else if (seconds < 86400) {
        setRelativeTime(`${Math.floor(seconds / 3600)}h ago`);
      } else {
        setRelativeTime(`${Math.floor(seconds / 86400)}d ago`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [timestamp]);

  return relativeTime;
}
