'use client';

import React, { useState } from 'react';
import type { Gig } from '@/lib/constants';
import DisputeCard from './DisputeCard';
import toast from 'react-hot-toast';
import styles from './DisputePanel.module.css';

import { useWriteContract } from 'wagmi';
import { useGigs } from '@/hooks/useGigs';
import { MINIGIGS_CONTRACT_ADDRESS, CUSD_ADDRESS } from '@/lib/constants';
import { MINI_GIGS_ABI } from '@/lib/abi';

export default function DisputePanel() {
  const { gigs: liveGigs } = useGigs();
  const { writeContractAsync } = useWriteContract();

  const disputedGigs = liveGigs.filter(g => g.status === 'disputed');

  const handleResolve = async (gig: Gig, inFavorOf: 'poster' | 'worker') => {
    toast.loading('Resolving dispute on-chain...', { id: 'resolve' });
    try {
      const payoutToPoster = inFavorOf === 'poster' ? 100n : 0n;
      await writeContractAsync({
        address: MINIGIGS_CONTRACT_ADDRESS,
        abi: MINI_GIGS_ABI,
        functionName: 'resolveDispute',
        args: [BigInt(gig.id), payoutToPoster],
      });
      toast.success(`Dispute resolved in favor of ${inFavorOf}`, { id: 'resolve' });
    } catch (err: any) {
      console.error(err);
      toast.error(err.shortMessage || 'Failed to resolve dispute', { id: 'resolve' });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Dispute Resolution Center</h2>
        <p>Admin control panel for resolving platform disputes</p>
      </div>
      <div className={styles.content}>
        {disputedGigs.length === 0 ? (
          <div className={styles.emptyState}>No active disputes.</div>
        ) : (
          disputedGigs.map((gig) => <DisputeCard key={gig.id} gig={gig} onResolve={handleResolve} />)
        )}
      </div>
    </div>
  );
}
