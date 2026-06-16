'use client';

import React, { Suspense } from 'react';
import { AppLayout } from './AppLayout';
import { TabId } from './BottomNav';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function NavigationWrapperInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  let activeTab: TabId = 'explore';
  if (pathname === '/profile') {
    activeTab = 'profile';
  } else if (pathname === '/analytics') {
    activeTab = 'explore'; // Analytics is a separate route without a dedicated tab icon for now
  } else {
    const tab = searchParams.get('tab');
    if (tab && ['explore', 'my-tasks', 'agents', 'wallet', 'profile'].includes(tab)) {
      activeTab = tab as TabId;
    }
  }

  const handleNavigate = (tab: TabId) => {
    if (tab === 'profile') {
      router.push('/profile');
    } else {
      router.push(`/marketplace?tab=${tab}`);
    }
  };

  // The landing page has its own layout and header, don't wrap it in AppLayout
  if (pathname === '/') {
    return <>{children}</>;
  }

  return (
    <AppLayout activeTab={activeTab} onNavigate={handleNavigate}>
      {children}
    </AppLayout>
  );
}

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="layout-mobile">
          <div className="min-height-100dvh bg-base flex-center">Loading...</div>
        </div>
      }
    >
      <NavigationWrapperInner>{children}</NavigationWrapperInner>
    </Suspense>
  );
}

// EOF update 1781535793993

// EOF update 1781632403028
