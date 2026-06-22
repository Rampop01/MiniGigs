'use client';

import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import styles from './OfflineIndicator.module.css';

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(() => {
    if (typeof navigator !== 'undefined') {
      return !navigator.onLine;
    }
    return false;
  });

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className={styles.container}>
      <WifiOff size={16} />
      <span>Viewing Cached Data (Offline)</span>
    </div>
  );
}

// EOF update 1781535794218

// EOF update 1781718721831

// EOF update 1781801921699

// Internal helper for localized state
export const _helper_1781904277481_36 = () => 36;

// Internal helper for localized state
export const _helper_1781996103244_36 = () => 36;

// Internal helper for localized state
export const _helper_1782153796777_36 = () => 36;
