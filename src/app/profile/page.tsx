'use client';

import React, { useEffect, useState } from 'react';
import { truncateAddress, formatCUSD, timeAgo } from '@/lib/formatters';
import styles from './profile.module.css';

// Mock data for profile
const MOCK_PROFILE = {
  address: '0x7a58c9b2...4f3a',
  joinDate: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
  stats: {
    posted: 12,
    completed: 45,
    inProgress: 3,
  },
  earnings: 1250.5, // cUSD
  achievements: [
    { id: '1', name: 'Early Adopter', icon: '🌟' },
    { id: '2', name: 'Top Earner', icon: '💰' },
    { id: '3', name: '100+ Gigs', icon: '🎯' },
    { id: '4', name: 'Fast Payer', icon: '⚡' },
  ],
  recentActivity: [
    { id: 'a1', title: 'Completed Web3 Translation Gig', type: 'earn', amount: 25, date: Date.now() - 86400000 },
    { id: 'a2', title: 'Posted Smart Contract Audit', type: 'spend', amount: 500, date: Date.now() - 172800000 },
    { id: 'a3', title: 'Completed UI Testing', type: 'earn', amount: 15, date: Date.now() - 259200000 },
  ]
};

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className={styles.main}>
      {/* Header / Basic Info */}
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>
          {MOCK_PROFILE.address.slice(2, 4).toUpperCase()}
        </div>
        <div className={styles.userInfo}>
          <div className={styles.address}>
            {truncateAddress(MOCK_PROFILE.address)}
            <span className={styles.badge}>Level 12</span>
          </div>
          <div className={styles.joinDate}>
            Joined {timeAgo(MOCK_PROFILE.joinDate)}
          </div>
        </div>
      </div>

      {address && address.toLowerCase() === '0x1111222233334444555566667777888899990000' && (
        <button 
          className="btn-primary" 
          style={{ width: '100%', padding: '16px', background: 'var(--accent-rose)', color: 'white', marginTop: '16px' }}
          onClick={() => window.location.href = '/admin/disputes'}
        >
          Dispute Resolution Center
        </button>
      )}

      {/* Settings Options */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Overview</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{MOCK_PROFILE.stats.posted}</div>
            <div className={styles.statLabel}>Posted</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{MOCK_PROFILE.stats.completed}</div>
            <div className={styles.statLabel}>Completed</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{MOCK_PROFILE.stats.inProgress}</div>
            <div className={styles.statLabel}>Active</div>
          </div>
        </div>
      </div>

      {/* Total Earnings Summary */}
      <div className={styles.section}>
        <div className={styles.statCard} style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className={styles.statLabel}>Total Earned</div>
            <div className={styles.statValue} style={{ color: 'var(--celo-prosperity)', marginBottom: 0 }}>
              {formatCUSD(MOCK_PROFILE.earnings)}
            </div>
          </div>
          <div style={{ fontSize: '2rem' }}>💸</div>
        </div>
      </div>

      {/* Achievements */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Badges</h2>
        <div className={styles.achievementsGrid}>
          {MOCK_PROFILE.achievements.map(ach => (
            <div key={ach.id} className={styles.achievementBadge}>
              <div className={styles.achievementIcon}>{ach.icon}</div>
              <div className={styles.achievementName}>{ach.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Activity</h2>
        <div className={styles.timeline}>
          {MOCK_PROFILE.recentActivity.map(item => (
            <div key={item.id} className={styles.timelineItem}>
              <div className={styles.timelineDot} style={{ background: item.type === 'earn' ? 'var(--celo-prosperity)' : 'var(--primary)' }} />
              <div className={styles.timelineTitle}>{item.title}</div>
              <div className={styles.timelineMeta}>
                <span className={item.type === 'earn' ? styles.timelineEarned : ''}>
                  {item.type === 'earn' ? '+' : '-'}{formatCUSD(item.amount)}
                </span>
                <span>{timeAgo(item.date)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
