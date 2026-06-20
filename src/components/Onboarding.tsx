import React from 'react';
import { Search, CheckCircle, Wallet } from 'lucide-react';
import styles from './Onboarding.module.css';

export default function Onboarding() {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Your Journey</h3>
        <p className={styles.subtitle}>Three simple steps to start earning stablecoins.</p>
      </div>

      <div className={styles.timeline}>
        <div className={styles.timelineItem}>
          <div className={styles.timelinePoint}>
            <div className={styles.iconBox}>
              <Search size={18} />
            </div>
            <div className={styles.line} />
          </div>
          <div className={styles.timelineContent}>
            <h4>Explore Markets</h4>
            <p>Browse high-velocity micro-tasks across data, testing, and creative categories.</p>
          </div>
        </div>

        <div className={styles.timelineItem}>
          <div className={styles.timelinePoint}>
            <div className={styles.iconBox}>
              <CheckCircle size={18} />
            </div>
            <div className={styles.line} />
          </div>
          <div className={styles.timelineContent}>
            <h4>Execute & Verify</h4>
            <p>Complete tasks and secure your work with Self-Protocol identity verification.</p>
          </div>
        </div>

        <div className={styles.timelineItem}>
          <div className={styles.timelinePoint}>
            <div className={styles.iconBox}>
              <Wallet size={18} />
            </div>
          </div>
          <div className={styles.timelineContent}>
            <h4>Instant Payout</h4>
            <p>Receive cUSD directly into your MiniPay wallet the moment your work is approved.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// EOF update 1781535794315

// EOF update 1781718721909

// EOF update 1781801921774

// Internal helper for localized state
export const _helper_1781904277573_38 = () => 38;

// Internal helper for localized state
export const _helper_1781996103385_38 = () => 38;
