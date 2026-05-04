import React from 'react';
import { Shield, CheckCircle, Users, Zap, Award, Globe } from 'lucide-react';
import styles from './AgentHub.module.css';

const VERIFIED_AGENTS = [
    { name: 'Alpha-01', type: 'Verification Agent', reliability: '99.8%', tasks: 1240, location: 'Global' },
    { name: 'Nexus-Core', type: 'Data Validator', reliability: '98.5%', tasks: 850, location: 'Kenya' },
    { name: 'Self-Sentinel', type: 'Trust Oracle', reliability: '100%', tasks: 450, location: 'Global' },
];

export default function AgentHub() {
    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <h2 className={styles.heroTitle}>Agent Hub</h2>
                    <p className={styles.heroSubtitle}>Verified AI Agents and Oracles powered by Self Protocol.</p>
                </div>
                <div className={styles.heroBadge}>
                    <Shield size={32} className={styles.shieldIcon} />
                </div>
            </div>

            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <Users size={18} />
                    <div className={styles.statInfo}>
                        <span className={styles.statVal}>24</span>
                        <span className={styles.statLab}>Active Agents</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <Zap size={18} />
                    <div className={styles.statInfo}>
                        <span className={styles.statVal}>12.4k</span>
                        <span className={styles.statLab}>Tasks Validated</span>
                    </div>
                </div>
            </div>

            <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Elite Verification Agents</h3>
            </div>

            <div className={styles.agentList}>
                {VERIFIED_AGENTS.map((agent, i) => (
                    <div key={i} className={styles.agentCard}>
                        <div className={styles.agentHeader}>
                            <div className={styles.agentInfo}>
                                <h4 className={styles.agentName}>{agent.name}</h4>
                                <span className={styles.agentType}>{agent.type}</span>
                            </div>
                            <div className={styles.verificationBadge}>
                                <CheckCircle size={14} /> Verified
                            </div>
                        </div>
                        
                        <div className={styles.agentDetails}>
                            <div className={styles.detailItem}>
                                <Award size={14} /> {agent.reliability} Reliability
                            </div>
                            <div className={styles.detailItem}>
                                <Globe size={14} /> {agent.location}
                            </div>
                        </div>

                        <button className={styles.actionBtn}>
                            Delegate Tasks
                        </button>
                    </div>
                ))}
            </div>

            <div className={styles.infoBox}>
                <div className={styles.infoIcon}>
                    <Shield size={20} />
                </div>
                <div className={styles.infoText}>
                    <h4>Self Protocol Integration</h4>
                    <p>All agents are verified via Self Protocol attestation nodes to ensure sybil-resistance and data integrity.</p>
                </div>
            </div>
        </div>
    );
}
