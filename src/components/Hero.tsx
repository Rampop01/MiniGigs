'use client';
import React from 'react';
import { Zap, Shield, Clock, Globe, Coins, CheckCircle } from 'lucide-react';
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

        <div className={styles.marqueeContainer} aria-hidden="true">
          <div className={styles.marqueeContent}>
            <span className={styles.marqueeItem}><Zap size={14} /> Micro-Tasks</span>
            <span className={styles.dot}>•</span>
            <span className={styles.marqueeItem}><Coins size={14} /> Earn cUSD Instantly</span>
            <span className={styles.dot}>•</span>
            <span className={styles.marqueeItem}><Shield size={14} /> Self Protocol Secured</span>
            <span className={styles.dot}>•</span>
            <span className={styles.marqueeItem}><Clock size={14} /> No Waiting Periods</span>
            <span className={styles.dot}>•</span>
            <span className={styles.marqueeItem}><Globe size={14} /> 100% On-Chain</span>
            <span className={styles.dot}>•</span>
            <span className={styles.marqueeItem}><CheckCircle size={14} /> Verified Workers</span>
            <span className={styles.dot}>•</span>
            {/* Duplicated for seamless looping */}
            <span className={styles.marqueeItem}><Zap size={14} /> Micro-Tasks</span>
            <span className={styles.dot}>•</span>
            <span className={styles.marqueeItem}><Coins size={14} /> Earn cUSD Instantly</span>
            <span className={styles.dot}>•</span>
            <span className={styles.marqueeItem}><Shield size={14} /> Self Protocol Secured</span>
            <span className={styles.dot}>•</span>
            <span className={styles.marqueeItem}><Clock size={14} /> No Waiting Periods</span>
            <span className={styles.dot}>•</span>
            <span className={styles.marqueeItem}><Globe size={14} /> 100% On-Chain</span>
            <span className={styles.dot}>•</span>
            <span className={styles.marqueeItem}><CheckCircle size={14} /> Verified Workers</span>
          </div>
        </div>

        <div className={styles.trustRow}>
          <div className={styles.trustItem}>
            <Zap size={14} /> <span>Instant Payouts</span>
          </div>
          <div className={styles.trustItem}>
            <Shield size={14} /> <span>Self Protocol Secured</span>
          </div>
          <a
            href="https://celoscan.io"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.trustItem}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Globe size={14} /> <span>Verified On-Chain</span>
          </a>
        </div>
      </div>

      <div className={styles.visuals}>
        <div className={styles.orb} />
        <div className={styles.orbSecondary} />
      </div>
    </section>
  );
}

// EOF update 1781535793863

// EOF update 1781632402952

// EOF update 1781718721564

// EOF update 1781801921401
