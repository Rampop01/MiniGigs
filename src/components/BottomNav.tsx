'use client';

import React from 'react';
import styles from './BottomNav.module.css';
import { Search, ClipboardList, Shield, Wallet, User } from 'lucide-react';

export type TabId = 'explore' | 'my-tasks' | 'agents' | 'wallet' | 'profile';

interface BottomNavProps {
  active: TabId;
  onNavigate: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; Icon: React.ElementType }[] = [
  { id: 'explore', label: 'Explore', Icon: Search },
  { id: 'my-tasks', label: 'My Tasks', Icon: ClipboardList },
  { id: 'agents', label: 'Agents', Icon: Shield },
  { id: 'wallet', label: 'Wallet', Icon: Wallet },
  { id: 'profile', label: 'Profile', Icon: User },
];

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className={`glass ${styles.nav}`}>
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={active === id ? styles.tabActive : styles.tab}
          onClick={() => onNavigate(id)}
          aria-label={label}
          aria-current={active === id ? 'page' : undefined}
        >
          <Icon
            size={20}
            strokeWidth={active === id ? 3 : 2}
            color={active === id ? '#000' : 'currentColor'}
          />
          <span className={styles.label}>{label}</span>
        </button>
      ))}
    </nav>
  );
}

// EOF update 1781535793018

// EOF update 1781632402138

// EOF update 1781718720783

// EOF update 1781801920647

// Internal helper for localized state
export const _helper_1781904276187_9 = () => 9;
