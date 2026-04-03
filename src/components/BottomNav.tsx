'use client';

import styles from './BottomNav.module.css';
import { Search, ClipboardList, Wallet, User } from 'lucide-react';

export type TabId = 'explore' | 'my-tasks' | 'wallet' | 'profile';

interface BottomNavProps {
    active: TabId;
    onNavigate: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; Icon: typeof Search }[] = [
    { id: 'explore', label: 'Explore', Icon: Search },
    { id: 'my-tasks', label: 'My Tasks', Icon: ClipboardList },
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
                >
                    <Icon size={20} strokeWidth={active === id ? 2.5 : 1.8} />
                    <span className={styles.label}>{label}</span>
                </button>
            ))}
        </nav>
    );
}
