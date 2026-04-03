'use client';

import { useState } from 'react';
import { GIG_CATEGORIES, TIME_ESTIMATES, VERIFICATION_METHODS, MINIGIGS_CONTRACT_ADDRESS, CUSD_ADDRESS } from '@/lib/constants';
import { X, Plus } from 'lucide-react';
import { useAccount, useWriteContract, useReadContract, useBalance } from 'wagmi';
import { MINI_GIGS_ABI, ERC20_ABI } from '@/lib/abi';
import { parseEther } from 'viem';
import toast from 'react-hot-toast';
import styles from './CreateGig.module.css';

interface CreateGigProps {
    onClose: () => void;
    onCreated: () => void;
}

export default function CreateGig({ onClose, onCreated }: CreateGigProps) {
    const { address, isConnected } = useAccount();
    const { writeContractAsync } = useWriteContract();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [bounty, setBounty] = useState('');
    const [timeEstimate, setTimeEstimate] = useState('');
    const [verification, setVerification] = useState('none');
    const [isPosting, setIsPosting] = useState(false);

    // Check cUSD allowance
    const { data: allowance } = useReadContract({
        address: CUSD_ADDRESS as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [address!, MINIGIGS_CONTRACT_ADDRESS as `0x${string}`],
        query: { enabled: !!address }
    });

    const { data: balance } = useBalance({
        address: address,
        token: CUSD_ADDRESS as `0x${string}`,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConnected) {
            toast.error('Connect your wallet to post a gig');
            return;
        }
        if (!title || !description || !category || !bounty) {
            toast.error('Please fill in all required fields');
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
            if (!allowance || allowance < bountyWei) {
                toast.loading('Approving cUSD...', { id: 'post-gig' });
                await writeContractAsync({
                    address: CUSD_ADDRESS as `0x${string}`,
                    abi: ERC20_ABI,
                    functionName: 'approve',
                    args: [MINIGIGS_CONTRACT_ADDRESS as `0x${string}`, bountyWei],
                });
                toast.success('cUSD Approved!', { id: 'post-gig' });
            }

            // Step 2: Post the Gig
            toast.loading('Posting Gig to Celo...', { id: 'post-gig' });

            await writeContractAsync({
                address: MINIGIGS_CONTRACT_ADDRESS as `0x${string}`,
                abi: MINI_GIGS_ABI,
                functionName: 'postGig',
                args: [
                    title,
                    description,
                    bountyWei,
                    BigInt(7) // default 7 days duration
                ],
            });

            toast.success('Gig posted on-chain successfully!', { id: 'post-gig' });
            onCreated();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error(error.shortMessage || 'Failed to post gig on-chain', { id: 'post-gig' });
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={`${styles.modal} glass`} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Post a Gig</h2>
                    <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label}>Title *</label>
                        <input
                            className="input"
                            placeholder="e.g. Translate App UI to Swahili"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            disabled={isPosting}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Description *</label>
                        <textarea
                            className="input"
                            placeholder="Describe the task, deliverables, and acceptance criteria..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            disabled={isPosting}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Category *</label>
                            <select
                                className="input"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                disabled={isPosting}
                            >
                                <option value="">Select</option>
                                {GIG_CATEGORIES.map(c => (
                                    <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
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
                                onChange={e => setBounty(e.target.value)}
                                disabled={isPosting}
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Time Estimate</label>
                            <select
                                className="input"
                                value={timeEstimate}
                                onChange={e => setTimeEstimate(e.target.value)}
                                disabled={isPosting}
                            >
                                <option value="">Select</option>
                                {TIME_ESTIMATES.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Verification Level</label>
                            <select
                                className="input"
                                value={verification}
                                onChange={e => setVerification(e.target.value)}
                                disabled={isPosting}
                            >
                                {VERIFICATION_METHODS.map(v => (
                                    <option key={v.id} value={v.id}>{v.icon} {v.label}</option>
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
}
