'use client';

import React from 'react';
import { BarChart3, Users, DollarSign, Activity, TrendingUp } from 'lucide-react';
import styles from './analytics.module.css';

import { useGigs } from '@/hooks/useGigs';
import { useMemo } from 'react';

export default function AnalyticsPage() {
  const { gigs: liveGigs } = useGigs();

  const stats = useMemo(() => {
    let totalVolume = 0;
    let gigsCompleted = 0;
    const users = new Set<string>();
    const earners: Record<string, number> = {};

    liveGigs.forEach((g) => {
      users.add(g.poster.toLowerCase());
      if (g.worker) users.add(g.worker.toLowerCase());

      if (g.status === 'completed') {
        gigsCompleted++;
        totalVolume += g.bounty;

        if (g.worker) {
          const w = g.worker.toLowerCase();
          earners[w] = (earners[w] || 0) + g.bounty;
        }
      }
    });

    const topEarners = Object.entries(earners)
      .map(([address, earned]) => ({ address, earned }))
      .sort((a, b) => b.earned - a.earned)
      .slice(0, 5);

    return {
      totalVolume,
      activeUsers: users.size,
      gigsCompleted,
      successRate: liveGigs.length ? Math.round((gigsCompleted / liveGigs.length) * 100) : 0,
      topEarners,
      volumeHistory: [
        { label: 'Mon', value: 10 },
        { label: 'Tue', value: 20 },
        { label: 'Wed', value: 30 },
        { label: 'Thu', value: 50 },
        { label: 'Fri', value: 70 },
        { label: 'Sat', value: 40 },
        { label: 'Sun', value: Math.min(100, totalVolume > 0 ? 100 : 5) },
      ]
    };
  }, [liveGigs]);

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Analytics</h1>
        <p className={styles.subtitle}>Platform metrics and network health</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <DollarSign size={16} /> Total Volume
          </div>
          <div className={styles.statValue}>${stats.totalVolume.toLocaleString()}</div>
          <div className={`${styles.statTrend} ${styles.trendUp}`}>
            <TrendingUp size={12} /> +12% this week
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <Users size={16} /> Active Users
          </div>
          <div className={styles.statValue}>{stats.activeUsers}</div>
          <div className={`${styles.statTrend} ${styles.trendUp}`}>
            <TrendingUp size={12} /> +5% this week
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <Activity size={16} /> Gigs Done
          </div>
          <div className={styles.statValue}>{stats.gigsCompleted.toLocaleString()}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <BarChart3 size={16} /> Success Rate
          </div>
          <div className={styles.statValue}>{stats.successRate}%</div>
        </div>
      </div>

      <div className={styles.chartCard}>
        <h2 className={styles.chartTitle}>Weekly Volume</h2>
        <div className={styles.barChart}>
          {stats.volumeHistory.map((day, i) => (
            <div key={i} className={styles.barCol}>
              <div className={styles.bar} style={{ height: `${day.value}%` }} />
              <span className={styles.barLabel}>{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.chartCard}>
        <h2 className={styles.chartTitle}>Top Earners (7d)</h2>
        <div className={styles.leaderboard}>
          {stats.topEarners.map((earner, i) => (
            <div key={i} className={styles.leaderboardItem}>
              <div className={styles.lbRank}>{i + 1}</div>
              <div className={styles.lbUser}>
                <div className={styles.lbAvatar}>{earner.address.slice(2, 4).toUpperCase()}</div>
                <span className={styles.lbAddress}>{earner.address.slice(0, 6)}...{earner.address.slice(-4)}</span>
              </div>
              <div className={styles.lbScore}>${earner.earned}</div>
            </div>
          ))}
          {stats.topEarners.length === 0 && (
            <div style={{ color: 'var(--text-tertiary)', fontSize: 14, padding: '1rem' }}>No earners yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
