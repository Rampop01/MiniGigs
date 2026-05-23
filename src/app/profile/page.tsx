'use client';

import React, { useEffect, useState } from 'react';
import { truncateAddress, formatCUSD, timeAgo } from '@/lib/formatters';
import styles from './profile.module.css';

import { useMemo } from 'react';
import { useGigs } from '@/hooks/useGigs';

import { useAccount } from 'wagmi';

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const { address } = useAccount();
  const { gigs: liveGigs } = useGigs();

  useEffect(() => {
    setMounted(true);
  }, []);

  const myGigs = useMemo(() => {
    if (!address) return [];
    return liveGigs.filter(
      (g) =>
        g.poster.toLowerCase() === address.toLowerCase() ||
        g.worker?.toLowerCase() === address.toLowerCase()
    );
  }, [liveGigs, address]);

  const stats = useMemo(() => {
    let posted = 0;
    let completed = 0;
    let inProgress = 0;
    let earnings = 0;
    const recentActivity: { id: string; title: string; type: 'earn' | 'spend'; amount: number; date: number }[] = [];

    if (address) {
      const lowerAddress = address.toLowerCase();
      myGigs.forEach((g) => {
        const isPoster = g.poster.toLowerCase() === lowerAddress;
        const isWorker = g.worker?.toLowerCase() === lowerAddress;

        if (isPoster) posted++;
        if (isWorker && g.status === 'completed') {
          completed++;
          earnings += g.bounty;
          recentActivity.push({
            id: `earn-${g.id}`,
            title: `Completed: ${g.title}`,
            type: 'earn',
            amount: g.bounty,
            date: g.createdAt * 1000,
          });
        }
        if (isPoster && g.status === 'completed') {
          recentActivity.push({
            id: `spend-${g.id}`,
            title: `Paid: ${g.title}`,
            type: 'spend',
            amount: g.bounty,
            date: g.createdAt * 1000,
          });
        }
        if (isWorker && g.status === 'in_progress') inProgress++;
      });
    }

    return {
      posted,
      completed,
      inProgress,
      earnings,
      recentActivity: recentActivity.sort((a, b) => b.date - a.date).slice(0, 5),
    };
  }, [myGigs, address]);

  if (!mounted) return null;

  return (
    <main className={styles.main}>
      {/* Header / Basic Info */}
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>{address ? address.slice(2, 4).toUpperCase() : '??'}</div>
        <div className={styles.userInfo}>
          <div className={styles.address}>
            {address ? truncateAddress(address) : 'Guest User'}
            <span className={styles.badge}>Level 12</span>
          </div>
          <div className={styles.joinDate}>Active Member</div>
        </div>
      </div>

      {address && address.toLowerCase() === '0x1111222233334444555566667777888899990000' && (
        <button
          className="btn-primary"
          style={{
            width: '100%',
            padding: '16px',
            background: 'var(--accent-rose)',
            color: 'white',
            marginTop: '16px',
          }}
          onClick={() => (window.location.href = '/admin/disputes')}
        >
          Dispute Resolution Center
        </button>
      )}

      {/* Settings Options */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Overview</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.posted}</div>
            <div className={styles.statLabel}>Posted</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.completed}</div>
            <div className={styles.statLabel}>Completed</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.inProgress}</div>
            <div className={styles.statLabel}>Active</div>
          </div>
        </div>
      </div>

      {/* Total Earnings Summary */}
      <div className={styles.section}>
        <div
          className={styles.statCard}
          style={{
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div className={styles.statLabel}>Total Earned</div>
            <div
              className={styles.statValue}
              style={{ color: 'var(--celo-prosperity)', marginBottom: 0 }}
            >
              {formatCUSD(stats.earnings)}
            </div>
          </div>
          <div style={{ fontSize: '2rem' }}>💸</div>
        </div>
      </div>

      {/* Achievements */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Badges</h2>
        <div className={styles.achievementsGrid}>
          {[
            { id: '1', name: 'Early Adopter', icon: '🌟' },
            { id: '2', name: 'Active User', icon: '⚡' },
          ].map((ach) => (
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
          {stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((item) => (
              <div key={item.id} className={styles.timelineItem}>
                <div
                  className={styles.timelineDot}
                  style={{
                    background: item.type === 'earn' ? 'var(--celo-prosperity)' : 'var(--primary)',
                  }}
                />
                <div className={styles.timelineTitle}>{item.title}</div>
                <div className={styles.timelineMeta}>
                  <span className={item.type === 'earn' ? styles.timelineEarned : ''}>
                    {item.type === 'earn' ? '+' : '-'}
                    {formatCUSD(item.amount)}
                  </span>
                  <span>{timeAgo(item.date)}</span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>No recent activity.</div>
          )}
        </div>
      </div>
    </main>
  );
}
