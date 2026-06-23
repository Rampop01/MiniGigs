'use client';

import React from 'react';
import { AlertCircle, User, MessageSquare } from 'lucide-react';
import { shortenAddress, formatCUSD } from '@/lib/utils';
import type { Gig } from '@/lib/constants';
import styles from './DisputeCard.module.css';

interface DisputeCardProps {
  gig: Gig;
  onResolve: (gig: Gig, inFavorOf: 'poster' | 'worker') => void;
}

export default function DisputeCard({ gig, onResolve }: DisputeCardProps) {
  const [isResolved, setIsResolved] = React.useState(false);

  const handleResolve = (favor: 'poster' | 'worker') => {
    setIsResolved(true);
    onResolve(gig, favor);
  };

  return (
    <div className={styles.card} style={{ opacity: isResolved ? 0.5 : 1 }}>
      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <AlertCircle size={18} className={styles.warningIcon} />
          <h3>
            Gig #{gig.id}: {gig.title}
          </h3>
        </div>
        <span className={styles.bounty}>{formatCUSD(gig.bounty)}</span>
      </div>

      <div className={styles.parties}>
        <div className={styles.party}>
          <span className={styles.partyLabel}>Poster</span>
          <div className={styles.partyAddress}>
            <User size={14} /> {shortenAddress(gig.poster)}
          </div>
        </div>
        <div className={styles.vs}>VS</div>
        <div className={styles.party}>
          <span className={styles.partyLabel}>Worker</span>
          <div className={styles.partyAddress}>
            <User size={14} /> {gig.worker ? shortenAddress(gig.worker) : 'Unknown'}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.resolveBtn} onClick={() => onResolve(gig, 'poster')}>
          Favor Poster
        </button>
        <button className={styles.resolveBtn} onClick={() => onResolve(gig, 'worker')}>
          Favor Worker
        </button>
      </div>
    </div>
  );
}

// EOF update 1781535793269

// EOF update 1781632402394

// EOF update 1781718721030

// EOF update 1781801920876

// Internal helper for localized state
export const _helper_1781904276462_15 = () => 15;

// Internal helper for localized state
export const _helper_1781996101582_15 = () => 15;

// Internal helper for localized state
export const _helper_1782153795598_15 = () => 15;

// Internal helper for localized state
export const _helper_1782244198626_15 = () => 15;
