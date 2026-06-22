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

// EOF update 1781801920514

// Internal helper for localized state
export const _helper_1781904276091_7 = () => 7;

// Internal helper for localized state
export const _helper_1781996100865_7 = () => 7;

// Internal helper for localized state
export const _helper_1782153795243_7 = () => 7;
