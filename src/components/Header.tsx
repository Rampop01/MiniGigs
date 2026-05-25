'use client';

import { useState, useEffect } from 'react';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { CheckCircle, Bell } from 'lucide-react';
import styles from './Header.module.css';
import { useNotifications } from './NotificationProvider';
import NotificationCenter from './NotificationCenter';

export default function Header() {
  const { unreadCount, setIsOpen } = useNotifications();
  const [isMiniPay] = useState(() => {
    if (typeof window !== 'undefined') {
      const eth = window.ethereum as { isMiniPay?: boolean } | undefined;
      return !!eth?.isMiniPay;
    }
    return false;
  });
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Auto-trigger connect modal if in MiniPay and not connected
    if (isMiniPay && !isConnected && openConnectModal) {
      openConnectModal();
    }
  }, [isMiniPay, isConnected, openConnectModal]);

  return (
    <>
      {isOffline && (
        <div style={{ background: 'var(--accent-rose)', color: 'white', textAlign: 'center', padding: '4px', fontSize: '12px', fontWeight: 'bold' }}>
          You are currently offline. Some features may be unavailable.
        </div>
      )}
      <header className={styles.header}>
        <div className={styles.brand}>
          <Link href="/" className={styles.crazyLogo}>
            <span className={styles.logoM}>M</span>
            <span className={styles.logoText}>iniGigs</span>
          </Link>
          {!isMiniPay && <p className={styles.tagline}>Micro-tasks on Celo</p>}
          {isMiniPay && <p className={styles.tagline}>MiniPay Active</p>}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.notifBtn}
            onClick={() => setIsOpen(true)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className={styles.notifBadge}>{unreadCount}</span>}
          </button>

          <ConnectButton.Custom>
            {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
              const connected = mounted && account && chain;
              return (
                <button
                  className={connected ? styles.walletConnected : styles.walletBtn}
                  onClick={connected ? openAccountModal : openConnectModal}
                  type="button"
                >
                  {connected ? (
                    <>
                      <span className={styles.walletDot} />
                      {account.displayName}
                      <CheckCircle
                        size={10}
                        style={{ marginLeft: '4px', color: 'var(--accent-green)' }}
                      />
                    </>
                  ) : (
                    'Connect'
                  )}
                </button>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </header>
      <NotificationCenter />
    </>
  );
}
