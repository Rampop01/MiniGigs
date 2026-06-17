import React from 'react';
import Header from './Header';
import BottomNav, { TabId } from './BottomNav';
import OfflineIndicator from './OfflineIndicator';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: TabId;
  onNavigate: (tab: TabId) => void;
}

export const AppLayout = ({ children, activeTab, onNavigate }: AppLayoutProps) => {
  return (
    <div className="layout-mobile">
      <OfflineIndicator />
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <div className="anim-slide-up">{children}</div>
        </main>
        <BottomNav active={activeTab} onNavigate={onNavigate} />
      </div>
    </div>
  );
};

// EOF update 1781535792935

// EOF update 1781632402041

// EOF update 1781718720704
