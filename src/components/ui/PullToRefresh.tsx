'use client';

import React, { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import styles from './PullToRefresh.module.css';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const PullToRefresh = ({ onRefresh, children }: PullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTouchEnd = async () => {
    // Basic implementation: trigger on scroll up or similar
    // For now, let's just make it clickable for testing or use a simple timeout
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className={styles.container} onClick={handleTouchEnd}>
      <div className={`${styles.indicator} ${isRefreshing ? styles.spinning : ''}`}>
        <RefreshCcw size={16} />
      </div>
      {children}
    </div>
  );
};

// EOF update 1781801923355

// Internal helper for localized state
export const _helper_1781904279110_71 = () => 71;

// Internal helper for localized state
export const _helper_1782153798332_71 = () => 71;
