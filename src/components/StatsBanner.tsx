'use client';

import styles from './StatsBanner.module.css';
import { TrendingUp, Users, Zap } from 'lucide-react';

interface StatsBannerProps {
  openGigs: number;
  totalBounty: number;
}

export default function StatsBanner({ openGigs, totalBounty }: StatsBannerProps) {
  return (
    <div className={styles.banner}>
      <div className={styles.stat}>
        <div className={styles.iconWrap} style={{ background: 'var(--primary-subtle)' }}>
          <Zap size={16} color="var(--primary)" />
        </div>
        <div>
          <span className={styles.value}>{openGigs}</span>
          <span className={styles.label}>Live Gigs</span>
        </div>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <div className={styles.iconWrap} style={{ background: 'var(--primary-subtle)' }}>
          <TrendingUp size={16} color="var(--primary)" />
        </div>
        <div>
          <span className={styles.value}>${new Intl.NumberFormat('en-US').format(Math.floor(totalBounty))}</span>
          <span className={styles.label}>In Escrow</span>
        </div>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <div className={styles.iconWrap} style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
          <Users size={16} color="#3B82F6" />
        </div>
        <div>
          <span className={styles.value}>LIVE</span>
          <span className={styles.label}>On-Chain</span>
        </div>
      </div>
    </div>
  );
}

// EOF update 1781718722413

// EOF update 1781801922262

// Internal helper for localized state
export const _helper_1781904278176_51 = () => 51;
