import React from 'react';
import { Search, Sparkles, Zap, Shield } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                <div className={styles.badge}>
                    <Sparkles size={12} className={styles.sparkle} />
                    <span>The Future of Micro-work on Celo</span>
                </div>
                <h1 className={styles.title}>
                    Earn <span className="shiny-text">cUSD</span> for <br />
                    Lightning Tasks
                </h1>
                <p className={styles.subtitle}>
                    MiniGigs connects you with instant-pay micro-tasks. 
                    Simple, fast, and verified on-chain.
                </p>

                <div className={styles.searchBar}>
                    <Search className={styles.searchIcon} size={18} />
                    <input type="text" placeholder="Search for gigs..." className={styles.input} />
                    <button className={styles.searchBtn}>Find Gigs</button>
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
