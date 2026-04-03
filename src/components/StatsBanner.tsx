'use client';

import styles from './StatsBanner.module.css';
import { TrendingUp, Users, Zap } from 'lucide-react';

export default function StatsBanner() {
    return (
        <div className={styles.banner}>
            <div className={styles.stat}>
                <div className={styles.iconWrap} style={{ background: 'var(--primary-subtle)' }}>
                    <Zap size={16} color="var(--primary)" />
                </div>
                <div>
                    <span className={styles.value}>248</span>
                    <span className={styles.label}>Open Gigs</span>
                </div>
            </div>
            <div className={styles.divider} />
            <div className={styles.stat}>
                <div className={styles.iconWrap} style={{ background: 'var(--accent-green-bg)' }}>
                    <TrendingUp size={16} color="var(--accent-green)" />
                </div>
                <div>
                    <span className={styles.value}>$12.4k</span>
                    <span className={styles.label}>Paid Out</span>
                </div>
            </div>
            <div className={styles.divider} />
            <div className={styles.stat}>
                <div className={styles.iconWrap} style={{ background: 'var(--accent-sky-bg)' }}>
                    <Users size={16} color="var(--accent-sky)" />
                </div>
                <div>
                    <span className={styles.value}>1,847</span>
                    <span className={styles.label}>Workers</span>
                </div>
            </div>
        </div>
    );
}
