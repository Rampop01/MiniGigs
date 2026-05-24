import React from 'react';
import { Zap, Shield } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Earn <span className="shiny-text">cUSD</span> for <br />
          Lightning Tasks
        </h1>
        <p className={styles.subtitle}>
          MiniGigs connects you with instant-pay micro-tasks. Simple, fast, and verified on-chain.
        </p>

        <div className={styles.trustRow}>
          <div className={styles.trustItem}>
            <Zap size={14} /> <span>Instant Payouts</span>
          </div>
          <div className={styles.trustItem}>
            <Shield size={14} /> <span>Self Protocol Secured</span>
          </div>
        </div>
      </div>

      <div className={styles.visuals}>
        <div className={styles.orb} />
        <div className={styles.orbSecondary} />
      </div>
    </section>
  );
}
