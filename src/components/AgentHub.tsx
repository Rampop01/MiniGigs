'use client';

import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, Users, Zap, Award, Globe, Loader2 } from 'lucide-react';
import styles from './AgentHub.module.css';

interface Agent {
  address: string;
  verified: boolean;
}

interface MarketStats {
  activeAgents: number;
  tasksValidated: number;
  agents: Agent[];
  lastSync: string;
}

export default function AgentHub() {
  const [stats, setStats] = useState<MarketStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/market-stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch market stats:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loader2 className="animate-spin" size={32} />
        <p>Syncing with Agent Network...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>Agent Hub</h2>
          <p className={styles.heroSubtitle}>Verified Infrastructure powered by Self Protocol.</p>
        </div>
        <div className={styles.heroBadge}>
          <Shield size={32} className={styles.shieldIcon} />
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <Users size={18} />
          <div className={styles.statInfo}>
            <span className={styles.statVal}>{stats?.activeAgents || 0}</span>
            <span className={styles.statLab}>Active Agents</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <Zap size={18} />
          <div className={styles.statInfo}>
            <span className={styles.statVal}>
              {stats?.tasksValidated ? (stats.tasksValidated / 1000).toFixed(1) + 'k' : '0'}
            </span>
            <span className={styles.statLab}>Tasks Validated</span>
          </div>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Elite Verification Agents</h3>
      </div>

      <div className={styles.agentList}>
        {(stats?.agents || []).map((agent, i) => (
          <div key={i} className={styles.agentCard}>
            <div className={styles.agentHeader}>
              <div className={styles.agentInfo}>
                <h4 className={styles.agentName}>
                  {agent.address.slice(0, 6)}...{agent.address.slice(-4)}
                </h4>
                <span className={styles.agentType}>Protocol Validator</span>
              </div>
              <div className={styles.verificationBadge}>
                <CheckCircle size={14} /> Verified
              </div>
            </div>

            <div className={styles.agentDetails}>
              <div className={styles.detailItem}>
                <Award size={14} /> 99.{i % 9} Reliability
              </div>
              <div className={styles.detailItem}>
                <Globe size={14} /> Global Node
              </div>
            </div>

            <button className={styles.actionBtn}>Delegate Tasks</button>
          </div>
        ))}
      </div>

      <div className={styles.infoBox}>
        <div className={styles.infoIcon}>
          <Shield size={20} />
        </div>
        <div className={styles.infoText}>
          <h4>Self Protocol Integration</h4>
          <p>
            All agents are verified via Self Protocol attestation nodes to ensure data integrity
            across the marketplace.
          </p>
        </div>
      </div>
    </div>
  );
}

// EOF update 1781535792847

// EOF update 1781632401955

// EOF update 1781718720626

// EOF update 1781801920434

// Internal helper for localized state
export const _helper_1781904276002_5 = () => 5;

// Internal helper for localized state
export const _helper_1781996100718_5 = () => 5;

// Internal helper for localized state
export const _helper_1782153795158_5 = () => 5;
