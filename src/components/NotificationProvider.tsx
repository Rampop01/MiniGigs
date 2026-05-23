'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { useGigsEvents, GigEvent } from '@/hooks/useGigsEvents';

interface NotificationContextType {
  notifications: GigEvent[];
  unreadCount: number;
  markAllAsRead: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();
  const { events } = useGigsEvents(address);
  const [isOpen, setIsOpen] = useState(false);
  const [lastReadTimestamp, setLastReadTimestamp] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('minigigs_last_read') || 0);
    }
    return 0;
  });

  // Derived state: unread count based on lastReadTimestamp
  const unreadCount = events.filter((e) => e.timestamp > lastReadTimestamp).length;

  const markAllAsRead = () => {
    const now = Date.now();
    setLastReadTimestamp(now);
    localStorage.setItem('minigigs_last_read', now.toString());
  };

  const value = React.useMemo(
    () => ({
      notifications: events,
      unreadCount,
      markAllAsRead,
      isOpen,
      setIsOpen,
    }),
    [events, unreadCount, isOpen],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
