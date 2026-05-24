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

        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeContent}>
            <span>⚡ Complete Micro-Tasks</span>
            <span className={styles.dot}>•</span>
            <span>💰 Earn cUSD Instantly</span>
            <span className={styles.dot}>•</span>
            <span>🛡️ Secured by Self Protocol</span>
            <span className={styles.dot}>•</span>
            <span>🚀 No Waiting Periods</span>
            <span className={styles.dot}>•</span>
            <span>🌍 100% On-Chain</span>
            <span className={styles.dot}>•</span>
            {/* Duplicated for seamless scrolling */}
            <span>⚡ Complete Micro-Tasks</span>
            <span className={styles.dot}>•</span>
            <span>💰 Earn cUSD Instantly</span>
            <span className={styles.dot}>•</span>
            <span>🛡️ Secured by Self Protocol</span>
            <span className={styles.dot}>•</span>
            <span>🚀 No Waiting Periods</span>
            <span className={styles.dot}>•</span>
            <span>🌍 100% On-Chain</span>
          </div>
        </div>

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
