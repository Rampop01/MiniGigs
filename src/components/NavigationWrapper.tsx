'use client';

import React, { useState } from 'react';
import { AppLayout } from './AppLayout';
import { TabId } from './BottomNav';
import MarketplacePage from '../app/marketplace/page';
import AdminPanel from './AdminPanel';
import AgentHub from './AgentHub';

// This is a simple client-side router for the MiniPay experience
export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabId>('explore');

  const renderContent = () => {
    switch (activeTab) {
      case 'explore':
        return children;
      case 'my-tasks':
        return <MarketplacePage filter="my" />; // We'll update MarketplacePage to handle filters
      case 'agents':
        return <AgentHub />;
      case 'wallet':
        return (
          <div className="flex flex-col items-center justify-center min-height-50vh">
            <h2 className="text-xl font-bold">Wallet View</h2>
            <p className="text-gray-400">Coming soon to MiniPay</p>
          </div>
        );
      case 'profile':
        return <AdminPanel />;
      default:
        return children;
    }
  };

  return (
    <AppLayout activeTab={activeTab} onNavigate={setActiveTab}>
      {renderContent()}
    </AppLayout>
  );
}
