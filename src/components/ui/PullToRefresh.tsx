'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';
import styles from './PullToRefresh.module.css';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const PullToRefresh = ({ onRefresh, children }: PullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.indicator} ${isRefreshing ? styles.spinning : ''}`}>
        <RefreshCcw size={16} />
      </div>
      {children}
    </div>
  );
};
