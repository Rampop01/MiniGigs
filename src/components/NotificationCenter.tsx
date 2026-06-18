'use client';

import React, { useEffect } from 'react';
import { useNotifications } from './NotificationProvider';
import { X, Bell, Info, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import styles from './NotificationCenter.module.css';
import { useRelativeTime } from '@/hooks/useRelativeTime';

export default function NotificationCenter() {
  const { notifications, unreadCount, markAllAsRead, isOpen, setIsOpen } = useNotifications();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => setIsOpen(false)}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <Bell size={20} className={styles.headerIcon} />
            <h2>Activity Feed</h2>
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </div>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          {notifications.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>📭</div>
              <p>No activity yet.</p>
              <span>Gig events will appear here in real-time.</span>
            </div>
          ) : (
            notifications.map((notif, idx) => (
              <NotificationItem key={`${notif.gigId}-${idx}`} notif={notif} />
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className={styles.footer}>
            <button className={styles.markBtn} onClick={markAllAsRead}>
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationItem({ notif }: { notif: any }) {
  const timeAgo = useRelativeTime(Number(notif.timestamp));

  const getIcon = (type: string) => {
    switch (type) {
      case 'posted':
        return <Info size={18} className={styles.infoIcon} />;
      case 'accepted':
        return <CheckCircle size={18} className={styles.successIcon} />;
      case 'submitted':
        return <Clock size={18} className={styles.pendingIcon} />;
      case 'completed':
        return <CheckCircle size={18} className={styles.payoutIcon} />;
      default:
        return <AlertCircle size={18} className={styles.defaultIcon} />;
    }
  };

  return (
    <div
      className={styles.notifItem}
      onClick={() => {
        // In a real app, this would navigate or open a modal
        console.log(`Viewing Gig #${notif.gigId}`);
      }}
      role="button"
      tabIndex={0}
    >
      <div className={styles.iconContainer}>{getIcon(notif.type)}</div>
      <div className={styles.details}>
        <p className={styles.message}>
          Gig <strong>#{notif.gigId.toString()}</strong> was {notif.type}
        </p>
        <span className={styles.time}>{timeAgo}</span>
      </div>
    </div>
  );
}

// EOF update 1781535794090

// EOF update 1781718721717

// EOF update 1781801921581
