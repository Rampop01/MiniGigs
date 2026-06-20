'use client';

import type { Gig } from '@/lib/constants';
import { getCategoryInfo, formatCUSD, timeAgo, formatDate } from '@/lib/utils';
import { Clock, ShieldCheck, Globe } from 'lucide-react';
import styles from './GigCard.module.css';

interface GigCardProps {
  gig: Gig;
  now?: number;
  onClick?: () => void;
}

function VerificationIcon({ method }: { method: string }) {
  if (method === 'worldid') return <Globe size={12} />;
  if (method === 'self') return <ShieldCheck size={12} />;
  return null;
}

export default function GigCard({ gig, now, onClick }: GigCardProps) {
  const cat = getCategoryInfo(gig.category);
  const isLive = now ? now - gig.createdAt < 300000 : false;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <article
      className={`card ${styles.card} anim-fade-up`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : 'article'}
      aria-label={`View details for ${gig.title}`}
    >
      {isLive && (
        <div className={styles.liveBadge}>
          <div className={styles.pulse} />
          <span>Live</span>
        </div>
      )}
      <div className={styles.top}>
        <div className={styles.iconBox}>
          <cat.Icon size={16} color="var(--primary)" />
        </div>
        <div className={styles.meta}>
          <span className={styles.catLabel}>{cat.label}</span>
          <span className={styles.dot}>·</span>
          <span className={styles.time} title={formatDate(gig.createdAt)}>{timeAgo(gig.createdAt)}</span>
        </div>
      </div>
      <h3 className={styles.title}>{gig.title}</h3>
      <p className={styles.desc}>{gig.description}</p>
      <div className={styles.tags}>
        <span className={styles.bounty}>{formatCUSD(gig.bounty)}</span>
        <span className={`badge badge-surface`}>
          <Clock size={12} /> {gig.timeEstimate || '3h'}
        </span>
        {gig.verification !== 'none' && (
          <span className={`badge badge-amber`}>
            <VerificationIcon method={gig.verification} />
            {gig.verification === 'worldid' ? 'World ID' : 'Self Protocol'}
          </span>
        )}
        <span
          className={`badge ${
            gig.status === 'open'
              ? 'badge-blue'
              : gig.status === 'disputed'
                ? 'badge-rose'
                : 'badge-surface'
          }`}
        >
          {gig.status === 'open'
            ? 'Open'
            : gig.status.charAt(0).toUpperCase() + gig.status.slice(1).replace('_', ' ')}
        </span>
      </div>
    </article>
  );
}

// EOF update 1781535793607

// EOF update 1781632402724

// EOF update 1781718721335

// EOF update 1781801921175

// Internal helper for localized state
export const _helper_1781904276879_23 = () => 23;

// Internal helper for localized state
export const _helper_1781996102409_23 = () => 23;
