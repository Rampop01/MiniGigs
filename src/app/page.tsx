'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Onboarding from '@/components/Onboarding';
import { Sparkles, ArrowRight, ShieldCheck, Globe, Zap, Users, BarChart3 } from 'lucide-react';
import styles from './landing.module.css';

export default function LandingPage() {
  return (
    <div className="layout-mobile">
      <div className={styles.container}>
        <Header />

        <main className={styles.main}>
          {/* Hero Section */}
          <Hero />

          {/* Call to Action Primary */}
          <div className={styles.ctaWrap}>
            <Link href="/marketplace" className={styles.mainBtn}>
              Launch Marketplace <ArrowRight size={20} />
            </Link>
            <p className={styles.hint}>No account needed. Just connect your MiniPay wallet.</p>
          </div>

          {/* Feature Grid */}
          <section className={styles.features}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Built for the <br />
                Global South
              </h2>
              <p className={styles.sectionSubtitle}>
                MiniGigs is optimized for low-bandwidth, mobile-first micro-work.
              </p>
            </div>

            <div className={styles.grid}>
              <div className={styles.featureCard}>
                <div className={styles.iconBox} style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                  <Zap color="var(--primary)" />
                </div>
                <h3>Instant cUSD</h3>
                <p>
                  Get paid the moment your work is approved. No waiting days for bank transfers.
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.iconBox} style={{ background: 'var(--primary-subtle)' }}>
                  <ShieldCheck color="var(--primary)" />
                </div>
                <h3>Self-Protocol</h3>
                <p>Your reputation is on-chain. Build trust with every gig you complete.</p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.iconBox} style={{ background: 'var(--primary-subtle)' }}>
                  <Globe color="var(--primary)" />
                </div>
                <h3>Global Access</h3>
                <p>Open to anyone, anywhere. All you need is a Celo-compatible wallet.</p>
              </div>
            </div>
          </section>

          {/* Stats / Proof Section */}
          <section className={styles.stats}>
            <div className={styles.statItem}>
              <Users size={32} />
              <strong>10,000+</strong>
              <span>Active Workers</span>
            </div>
            <div className={styles.statItem}>
              <BarChart3 size={32} />
              <strong>50,000+</strong>
              <span>Gigs Completed</span>
            </div>
          </section>

          {/* Featured Agents Section */}
          <section className={styles.agents}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Elite Agents</h2>
              <p className={styles.sectionSubtitle}>
                Top performers with verified on-chain reputations.
              </p>
            </div>
            <div className={styles.agentRow}>
              <div className={styles.agentTinyCard}>
                <div className={styles.agentAvatar}>AI</div>
                <span className={styles.agentName}>Agent.88</span>
                <div className={styles.trustScore}>100% Trust</div>
              </div>
              <div className={styles.agentTinyCard}>
                <div
                  className={styles.agentAvatar}
                  style={{ background: 'var(--primary-subtle)', color: 'var(--primary)' }}
                >
                  BK
                </div>
                <span className={styles.agentName}>BlockKing</span>
                <div className={styles.trustScore}>99% Trust</div>
              </div>
              <div className={styles.agentTinyCard}>
                <div
                  className={styles.agentAvatar}
                  style={{ background: 'var(--primary-subtle)', color: 'var(--primary)' }}
                >
                  MP
                </div>
                <span className={styles.agentName}>MiniPro</span>
                <div className={styles.trustScore}>100% Trust</div>
              </div>
            </div>
          </section>

          <Onboarding />

          {/* Final CTA */}
          <section className={styles.finalCta}>
            <div className={styles.ctaContent}>
              <h2>Ready to start earning?</h2>
              <p>Join thousands of workers earning stablecoins daily.</p>
              <Link href="/marketplace" className="btn-primary">
                Enter the Market
              </Link>
            </div>
          </section>
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerBrand}>
            <strong>MiniGigs</strong>
            <span>Built on Celo</span>
          </div>
          <div className={styles.footerLinks}>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Docs</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
