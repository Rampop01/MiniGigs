'use client';

import type { Gig } from '@/lib/constants';
import { getCategoryInfo, formatCUSD, timeAgo, shortenAddress } from '@/lib/utils';
import { X, Clock, Shield, Globe, User, ExternalLink, CheckCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import styles from './GigDetail.module.css';

interface GigDetailProps {
    gig: Gig;
    onClose: () => void;
    onAccept?: (gig: Gig) => void;
}

export default function GigDetail({ gig, onClose, onAccept }: GigDetailProps) {
    const { address, isConnected } = useAccount();
    const cat = getCategoryInfo(gig.category);

    const isPoster = address && gig.poster.toLowerCase() === address.toLowerCase();
    const isWorker = address && gig.worker?.toLowerCase() === address.toLowerCase();

    const handleAction = () => {
        if (!isConnected) {
            toast.error('Please connect your wallet first');
            return;
        }
        // All actions (Accept, Submit, Complete) are passed back to the orchestrator
        onAccept?.(gig);
    };

    // Determine button text and visibility
    let actionLabel = 'Accept Gig';
    let showAction = true;

    if (gig.status === 'Open') {
        actionLabel = isPoster ? 'Waiting for Workers' : `Accept Gig — ${formatCUSD(gig.bounty)}`;
        if (isPoster) showAction = false;
    } else if (gig.status === 'InProgress') {
        actionLabel = isWorker ? 'Submit Proof of Work' : 'In Progress';
        if (!isWorker) showAction = false;
    } else if (gig.status === 'Submitted') {
        actionLabel = isPoster ? 'Release Funds' : 'Pending Review';
        if (!isPoster) showAction = false;
    } else if (gig.status === 'Completed') {
        actionLabel = 'Job Completed';
        showAction = false;
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={`${styles.modal} glass`} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <X size={20} />
                </button>

                {/* Header */}
                <div className={styles.header}>
                    <span className={styles.catBadge}>{cat.emoji} {cat.label}</span>
                    <span className={styles.bountyBig}>{formatCUSD(gig.bounty)}</span>
                </div>

                <h2 className={styles.title}>{gig.title}</h2>

                <div className={styles.metaRow}>
                    <span className={styles.metaItem}>
                        <Clock size={14} /> {gig.timeEstimate || '3h'}
                    </span>
                    <span className={styles.metaItem}>
                        <User size={14} /> {shortenAddress(gig.poster)}
                    </span>
                    <span className={styles.metaItem}>
                        {timeAgo(gig.createdAt)}
                    </span>
                </div>

                <div className={styles.divider} />

                <h4 className={styles.sectionLabel}>Description</h4>
                <p className={styles.description}>{gig.description}</p>

                {gig.status === 'Submitted' && gig.deliverables && (
                    <>
                        <div className={styles.divider} />
                        <h4 className={styles.sectionLabel}>Deliverables</h4>
                        <div className={styles.deliverablesBox}>
                            <p>{gig.deliverables}</p>
                        </div>
                    </>
                )}

                {gig.requiresVerification && (
                    <>
                        <div className={styles.divider} />
                        <div className={styles.verifyBanner}>
                            {gig.verificationLevel === 'high' ? <Globe size={18} /> : <Shield size={18} />}
                            <div>
                                <strong>Identity Verification Required</strong>
                                <p>A {gig.verificationLevel === 'high' ? 'World ID' : 'Self Protocol'} check is required for this market.</p>
                            </div>
                        </div>
                    </>
                )}

                <div className={styles.actions}>
                    {showAction ? (
                        <button className={styles.acceptBtn} onClick={handleAction}>
                            {actionLabel}
                        </button>
                    ) : (
                        <div className={styles.statusBadge}>
                            <CheckCircle size={18} /> {actionLabel}
                        </div>
                    )}
                    <button className={styles.viewChainBtn} onClick={() => window.open(`https://celoscan.io/address/${address}`, '_blank')}>
                        <ExternalLink size={14} /> View Explorer
                    </button>
                </div>
            </div>
        </div>
    );
}
