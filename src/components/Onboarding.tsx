import React from 'react';
import { Search, CheckCircle, Wallet, Award } from 'lucide-react';
import styles from './Onboarding.module.css';

export default function Onboarding() {
    return (
        <section className={styles.container}>
            <h3 className={styles.title}>How it Works</h3>
            <div className={styles.grid}>
                <div className={styles.step}>
                    <div className={styles.iconBox} style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                        <Search size={20} color="var(--primary)" />
                    </div>
                    <h4>Browse</h4>
                    <p>Find tasks that match your skills.</p>
                </div>
                <div className={styles.step}>
                    <div className={styles.iconBox} style={{ background: 'var(--primary-subtle)' }}>
                        <CheckCircle size={20} color="var(--primary)" />
                    </div>
                    <h4>Complete</h4>
                    <p>Finish the task and submit proof.</p>
                </div>
                <div className={styles.step}>
                    <div className={styles.iconBox} style={{ background: 'var(--primary-subtle)' }}>
                        <Wallet size={20} color="var(--primary)" />
                    </div>
                    <h4>Earn</h4>
                    <p>Get paid instantly in cUSD.</p>
                </div>
            </div>
        </section>
    );
}
