'use client';

import React from 'react';
import DisputePanel from '@/components/DisputePanel';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

export default function AdminDisputesPage() {
  return (
    <div className="layout-mobile">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: 'var(--bg-base)' }}>
        <Header />
        <main style={{ flex: 1, padding: '80px var(--sp-6) 120px var(--sp-6)', overflowY: 'auto' }}>
          <div className="anim-slide-up">
            <DisputePanel />
          </div>
        </main>
        <BottomNav active="profile" onNavigate={(tab) => window.location.href = `/marketplace?tab=${tab}`} />
      </div>
    </div>
  );
}
