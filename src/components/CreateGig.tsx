'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  GIG_CATEGORIES,
  TIME_ESTIMATES,
  VERIFICATION_METHODS,
  MINIGIGS_CONTRACT_ADDRESS,
  CUSD_ADDRESS,
} from '@/lib/constants';
import { X, Plus } from 'lucide-react';
import { useAccount, useWriteContract, useReadContract, useBalance, usePublicClient } from 'wagmi';
import { MINI_GIGS_ABI, ERC20_ABI } from '@/lib/abi';
import { parseEther } from 'viem';
import toast from 'react-hot-toast';
import { validateBounty } from '@/lib/utils';
import styles from './CreateGig.module.css';

interface CreateGigProps {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateGig({ onClose, onCreated }: CreateGigProps) {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [bounty, setBounty] = useState('');
  const [timeEstimate, setTimeEstimate] = useState('');
  const [verification, setVerification] = useState('none');
  const [isPosting, setIsPosting] = useState(false);
  const [bountyError, setBountyError] = useState<string | null>(null);

  // Check cUSD allowance
  const { data: allowance } = useReadContract({
    address: CUSD_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [address || '0x0000000000000000000000000000000000000000', MINIGIGS_CONTRACT_ADDRESS as `0x${string}`],
    query: { enabled: !!address },
  });

  const { data: balance } = useBalance({
    address: address || '0x0000000000000000000000000000000000000000',
    token: CUSD_ADDRESS as `0x${string}`,
    query: { enabled: !!address },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error('Connect your wallet to post a gig');
      return;
    }
    
    // The chainId from wagmi indicates the currently connected chain. 
    // Celo Mainnet is 42220.
    if (publicClient && publicClient.chain.id !== 42220) {
      toast.error('Please switch to Celo Mainnet to post a gig');
      return;
    }

    if (!title || !description || !category || !bounty) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (title.length < 5) {
      toast.error('Title must be at least 5 characters long');
      return;
    }
    if (title.length > 50) {
      toast.error('Title cannot exceed 50 characters');
      return;
    }

    if (description.length < 20) {
      toast.error('Description must be at least 20 characters long to provide enough detail');
      return;
    }

    try {
      setIsPosting(true);
      const bountyWei = parseEther(bounty);

      if (balance && balance.value < bountyWei) {
        toast.error('Insufficient cUSD balance');
        setIsPosting(false);
        return;
      }

      // Step 1: Approve cUSD if needed
      if (!allowance || (allowance as bigint) < bountyWei) {
        toast.loading('Approving cUSD...', { id: 'post-gig' });
        const hash = await writeContractAsync({
          address: CUSD_ADDRESS as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [MINIGIGS_CONTRACT_ADDRESS as `0x${string}`, bountyWei],
        });
        
        toast.loading('Waiting for approval confirmation...', { id: 'post-gig' });
        if (publicClient) {
          await publicClient.waitForTransactionReceipt({ hash });
        } else {
          // Fallback just in case publicClient is not immediately available
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
        
        toast.success('cUSD Approved!', { id: 'post-gig' });
      }

      // Step 2: Post the Gig
      toast.loading('Posting Gig to Celo...', { id: 'post-gig' });

      // Pack metadata into description for on-chain storage
      const metadataDescription = JSON.stringify({
        desc: description,
        cat: category,
        time: timeEstimate,
        ver: verification,
      });

      await writeContractAsync({
        address: MINIGIGS_CONTRACT_ADDRESS as `0x${string}`,
        abi: MINI_GIGS_ABI,
        functionName: 'postGig',
        args: [
          title,
          metadataDescription,
          bountyWei,
          BigInt(14), // default 14 days duration
        ],
      });

      toast.success('Gig posted on-chain successfully!', { id: 'post-gig' });
      onCreated();
      onClose();
    } catch (error: unknown) {
      const err = error as { shortMessage?: string };
      console.error(err);
      toast.error(err.shortMessage || 'Failed to post gig on-chain', { id: 'post-gig' });
    } finally {
      setIsPosting(false);
    }
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Prevent background scrolling while modal is open
    document.body.style.overflow = 'hidden';

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPosting) onClose();
    };
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, isPosting]);

  if (!isMounted) return null;

  const modalContent = (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} glass`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Post a Gig</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className={styles.label}>Title *</label>
              <span style={{ fontSize: '0.8rem', color: title.length > 50 ? 'var(--accent-rose)' : 'var(--text-secondary)' }}>
                {title.length} / 50
              </span>
            </div>
            <input
              className="input"
              placeholder="e.g. Translate App UI to Swahili"
              value={title}
              maxLength={50}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPosting}
            />
          </div>

          <div className={styles.field}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className={styles.label}>Description *</label>
              <span style={{ fontSize: '0.8rem', color: description.length < 20 ? 'var(--accent-rose)' : 'var(--text-secondary)' }}>
                {description.length} / 500
              </span>
            </div>
            <textarea
              className="input"
              placeholder="Describe the task, deliverables, and acceptance criteria..."
              value={description}
              maxLength={500}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPosting}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Category *</label>
              <select
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isPosting}
              >
                <option value="">Select</option>
                {GIG_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Bounty (cUSD) *</label>
              <input
                className="input"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="e.g. 10"
                value={bounty}
                onKeyDown={(e) => {
                  if (['e', 'E', '+', '-'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  setBounty(e.target.value);
                  setBountyError(validateBounty(e.target.value));
                }}
                disabled={isPosting}
              />
              {bountyError && (
                <span style={{ fontSize: '11px', color: 'var(--accent-rose)', marginTop: '4px', display: 'block' }}>
                  {bountyError}
                </span>
              )}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Time Estimate</label>
              <select
                className="input"
                value={timeEstimate}
                onChange={(e) => setTimeEstimate(e.target.value)}
                disabled={isPosting}
              >
                <option value="">Select</option>
                {TIME_ESTIMATES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Verification Level</label>
              <select
                className="input"
                value={verification}
                onChange={(e) => setVerification(e.target.value)}
                disabled={isPosting}
              >
                {VERIFICATION_METHODS.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isPosting}>
            {isPosting ? <span className={styles.spinner} /> : <Plus size={18} />}
            {isPosting ? 'Confirming...' : 'Post Gig on Mainnet'}
          </button>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

// EOF update 1781535793185

// EOF update 1781632402308

// EOF update 1781718720951

// EOF update 1781801920801
