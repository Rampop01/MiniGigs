'use client';

import React, { useState } from 'react';
import type { Gig } from '@/lib/constants';
import DisputeCard from './DisputeCard';
import toast from 'react-hot-toast';
import styles from './DisputePanel.module.css';

const MOCK_DISPUTED_GIGS: Gig[] = [
  {
    id: '42',
    poster: '0x1111222233334444555566667777888899990000',
    worker: '0xaaaabbbbccccddddeeeeffff0000111122223333',
    bounty: 50,
    title: 'Design Logo for Web3 Project',
    description: 'Worker claims submitted final SVG but it was just a raster image.',
    category: 'design',
    status: 'disputed',
    verification: 'none',
    timeEstimate: '5h',
    createdAt: Date.now() - 86400000 * 2,
  },
];

export default function DisputePanel() {
  const [gigs, setGigs] = useState<Gig[]>(MOCK_DISPUTED_GIGS);

  const handleResolve = async (gig: Gig, inFavorOf: 'poster' | 'worker') => {
    toast.loading('Resolving dispute on-chain...', { id: 'resolve' });
    await new Promise(r => setTimeout(r, 1500));
    toast.success(`Dispute resolved in favor of ${inFavorOf}`, { id: 'resolve' });
    setGigs((prev) => prev.filter((g) => g.id !== gig.id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Dispute Resolution Center</h2>
        <p>Admin control panel for resolving platform disputes</p>
      </div>
      <div className={styles.content}>
        {gigs.length === 0 ? (
          <div className={styles.emptyState}>No active disputes.</div>
        ) : (
          gigs.map((gig) => (
            <DisputeCard key={gig.id} gig={gig} onResolve={handleResolve} />
          ))
        )}
      </div>
    </div>
  );
}
