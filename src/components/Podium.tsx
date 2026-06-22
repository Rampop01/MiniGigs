import React from 'react';
import styles from './Podium.module.css';

interface Earner {
  address: string;
  earned: number;
}

interface PodiumProps {
  topEarners: Earner[];
}

export default function Podium({ topEarners }: PodiumProps) {
  if (!topEarners || topEarners.length < 3) return null;

  const [second, first, third] = topEarners;

  return (
    <div className={styles.podiumContainer}>
      {/* 2nd Place */}
      <div className={`${styles.podiumItem} ${styles.second}`}>
        <div className={styles.avatar}>{second.address.slice(2, 4).toUpperCase()}</div>
        <div className={styles.rank}>2</div>
        <div className={styles.earned}>${second.earned}</div>
      </div>

      {/* 1st Place */}
      <div className={`${styles.podiumItem} ${styles.first}`}>
        <div className={styles.avatar}>{first.address.slice(2, 4).toUpperCase()}</div>
        <div className={styles.rank}>1</div>
        <div className={styles.earned}>${first.earned}</div>
      </div>

      {/* 3rd Place */}
      <div className={`${styles.podiumItem} ${styles.third}`}>
        <div className={styles.avatar}>{third.address.slice(2, 4).toUpperCase()}</div>
        <div className={styles.rank}>3</div>
        <div className={styles.earned}>${third.earned}</div>
      </div>
    </div>
  );
}

// EOF update 1781535794401

// EOF update 1781718721988

// EOF update 1781801921849

// Internal helper for localized state
export const _helper_1781904277662_40 = () => 40;

// Internal helper for localized state
export const _helper_1782153796951_40 = () => 40;
