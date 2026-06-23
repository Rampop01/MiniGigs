import React, { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useBalance } from 'wagmi';
import { MINI_GIGS_ABI } from '@/lib/abi';
import { MINIGIGS_CONTRACT_ADDRESS, CUSD_ADDRESS } from '@/lib/constants';
import { Shield, Download, RefreshCcw, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './AdminPanel.module.css';

export default function AdminPanel() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [disputeId, setDisputeId] = useState('');
  const [payoutToPoster, setPayoutToPoster] = useState('0');

  // Read contract owner
  const { data: contractOwner } = useReadContract({
    address: MINIGIGS_CONTRACT_ADDRESS as `0x${string}`,
    abi: MINI_GIGS_ABI,
    functionName: 'owner',
  });

  // Read contract's cUSD balance
  const { data: contractBalance, isLoading: isBalanceLoading, refetch: refetchBalance } = useBalance({
    address: MINIGIGS_CONTRACT_ADDRESS as `0x${string}`,
    token: CUSD_ADDRESS as `0x${string}`,
  });

  // Read platform fee
  const { data: feeBps } = useReadContract({
    address: MINIGIGS_CONTRACT_ADDRESS as `0x${string}`,
    abi: MINI_GIGS_ABI,
    functionName: 'platformFeeBps',
  });

  const isOwner =
    address && contractOwner && address.toLowerCase() === (contractOwner as string).toLowerCase();

  const handleWithdraw = async () => {
    if (!isOwner) {
      toast.error('Unauthorized: Only contract owner can withdraw fees');
      return;
    }

    if (!contractBalance || contractBalance.value === BigInt(0)) {
      toast.error('No fees available for withdrawal');
      return;
    }

    try {
      setIsWithdrawing(true);
      toast.loading('Withdrawing fees from contract...', { id: 'withdraw' });

      await writeContractAsync({
        address: MINIGIGS_CONTRACT_ADDRESS as `0x${string}`,
        abi: MINI_GIGS_ABI,
        functionName: 'withdrawFees',
        args: [contractBalance.value],
      });

      toast.success('Fees withdrawn successfully!', { id: 'withdraw' });
      refetchBalance();
    } catch (error: unknown) {
      const err = error as { shortMessage?: string };
      console.error(err);
      toast.error(err.shortMessage || 'Withdrawal failed', { id: 'withdraw' });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleResolveDispute = async () => {
    if (!disputeId || payoutToPoster === '') {
      toast.error('Please provide both Gig ID and Poster Payout %');
      return;
    }

    try {
      setIsResolving(true);
      toast.loading('Resolving dispute on-chain...', { id: 'resolve' });

      await writeContractAsync({
        address: MINIGIGS_CONTRACT_ADDRESS as `0x${string}`,
        abi: MINI_GIGS_ABI,
        functionName: 'resolveDispute',
        args: [BigInt(disputeId), BigInt(payoutToPoster)],
      });

      toast.success('Dispute resolved successfully!', { id: 'resolve' });
      setDisputeId('');
      setPayoutToPoster('0');
    } catch (error: unknown) {
      const err = error as { shortMessage?: string };
      console.error(err);
      toast.error(err.shortMessage || 'Resolution failed', { id: 'resolve' });
    } finally {
      setIsResolving(false);
    }
  };

  if (!isConnected || !isOwner) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Shield className={styles.icon} size={20} />
        <h3 className={styles.title}>Admin Panel</h3>
      </div>

      <div className={styles.statsCard}>
        <div className={styles.statInfo}>
          <span className={styles.statLabel}>Contract Fees (cUSD)</span>
          <span className={styles.statValue}>
            {isBalanceLoading ? (
              <span className="animate-pulse bg-white/10 rounded h-8 w-32 inline-block"></span>
            ) : contractBalance ? (
              Number(contractBalance.formatted).toFixed(4)
            ) : (
              '0.0000'
            )}
          </span>
          <span className={styles.statSub}>
            <TrendingUp size={12} /> Fee Rate: {feeBps ? Number(feeBps) / 100 : '2'}%
          </span>
        </div>

        <button
          className={styles.withdrawBtn}
          onClick={handleWithdraw}
          disabled={isWithdrawing || !contractBalance || contractBalance.value === BigInt(0)}
        >
          {isWithdrawing ? (
            <RefreshCcw size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          Withdraw
        </button>
      </div>

      <div className={styles.divider} />

      <div className={styles.disputeSection}>
        <h4 className={styles.sectionSubtitle}>Dispute Resolution</h4>
        <div className={styles.inputGroup}>
          <input
            type="number"
            placeholder="Gig ID"
            className={styles.input}
            value={disputeId}
            onChange={(e) => setDisputeId(e.target.value)}
          />
          <input
            type="number"
            placeholder="Poster Payout % (0-100)"
            className={styles.input}
            min="0"
            max="100"
            value={payoutToPoster}
            onChange={(e) => setPayoutToPoster(e.target.value)}
          />
        </div>
        <button
          className={styles.resolveBtn}
          onClick={handleResolveDispute}
          disabled={isResolving || !disputeId || payoutToPoster === ''}
        >
          {isResolving ? <RefreshCcw size={16} className="animate-spin" /> : <Shield size={16} />}
          Resolve & Pay
        </button>
      </div>

      <p className={styles.footerText}>
        Fees are automatically collected from every completed gig and stored in the contract escrow.
      </p>
    </div>
  );
}

// EOF update 1781535792758

// EOF update 1781632401874

// EOF update 1781718720534

// EOF update 1781801920350

// Internal helper for localized state
export const _helper_1781904275901_3 = () => 3;

// Internal helper for localized state
export const _helper_1781996100577_3 = () => 3;

// Internal helper for localized state
export const _helper_1782153795071_3 = () => 3;

// Internal helper for localized state
export const _helper_1782244198074_3 = () => 3;
