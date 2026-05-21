'use client';

import React from 'react';
import { BarChart3, Users, DollarSign, Activity, TrendingUp } from 'lucide-react';
import styles from './analytics.module.css';

const MOCK_DATA = {
  totalVolume: 12500,
  activeUsers: 842,
  gigsCompleted: 1205,
  successRate: 94,
  volumeHistory: [
    { label: 'Mon', value: 40 },
    { label: 'Tue', value: 65 },
    { label: 'Wed', value: 45 },
    { label: 'Thu', value: 80 },
    { label: 'Fri', value: 55 },
    { label: 'Sat', value: 90 },
    { label: 'Sun', value: 100 },
  ],
  topEarners: [
    { address: '0x1234...5678', earned: 450 },
    { address: '0xabcd...ef01', earned: 380 },
    { address: '0x9876...5432', earned: 310 },
  ]
};

export default function AnalyticsPage() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Analytics</h1>
        <p className={styles.subtitle}>Platform metrics and network health</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <DollarSign size={16} /> Total Volume
          </div>
          <div className={styles.statValue}>${MOCK_DATA.totalVolume.toLocaleString()}</div>
          <div className={`${styles.statTrend} ${styles.trendUp}`}>
            <TrendingUp size={12} /> +12% this week
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <Users size={16} /> Active Users
          </div>
          <div className={styles.statValue}>{MOCK_DATA.activeUsers}</div>
          <div className={`${styles.statTrend} ${styles.trendUp}`}>
            <TrendingUp size={12} /> +5% this week
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <Activity size={16} /> Gigs Done
          </div>
          <div className={styles.statValue}>{MOCK_DATA.gigsCompleted.toLocaleString()}</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <BarChart3 size={16} /> Success Rate
          </div>
          <div className={styles.statValue}>{MOCK_DATA.successRate}%</div>
        </div>
      </div>

      <div className={styles.chartCard}>
        <h2 className={styles.chartTitle}>Weekly Volume</h2>
        <div className={styles.barChart}>
          {MOCK_DATA.volumeHistory.map((day, i) => (
            <div key={i} className={styles.barCol}>
              <div 
                className={styles.bar} 
                style={{ height: `${day.value}%` }}
              />
              <span className={styles.barLabel}>{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.chartCard}>
        <h2 className={styles.chartTitle}>Top Earners (7d)</h2>
        <div className={styles.leaderboard}>
          {MOCK_DATA.topEarners.map((earner, i) => (
            <div key={i} className={styles.leaderboardItem}>
              <div className={styles.lbRank}>{i + 1}</div>
              <div className={styles.lbUser}>
                <div className={styles.lbAvatar}>
                  {earner.address.slice(2, 4).toUpperCase()}
                </div>
                <span className={styles.lbAddress}>{earner.address}</span>
              </div>
              <div className={styles.lbScore}>${earner.earned}</div>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
