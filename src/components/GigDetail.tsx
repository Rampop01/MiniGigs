'use client';
import { createPortal } from 'react-dom';

import type { Gig } from '@/lib/constants';
import { getCategoryInfo, formatCUSD, timeAgo, shortenAddress } from '@/lib/utils';
import { X, Clock, ShieldCheck, Globe, User, ExternalLink, CheckCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import styles from './GigDetail.module.css';
import { useState, useEffect } from 'react';
import ReviewModal from './ReviewModal';
import DisputeModal from './DisputeModal';

interface GigDetailProps {
  gig: Gig;
  onClose: () => void;
  onAccept?: (gig: Gig, workProof?: string) => void;
  onDispute?: (gig: Gig) => void;
}

export default function GigDetail({ gig, onClose, onAccept, onDispute }: GigDetailProps) {
  const { address, isConnected } = useAccount();
  const [showReview, setShowReview] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [workProof, setWorkProof] = useState('');
  const cat = getCategoryInfo(gig.category);

  const isPoster = address && gig.poster.toLowerCase() === address.toLowerCase();
  const isWorker = address && gig.worker?.toLowerCase() === address.toLowerCase();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    document.body.style.overflow = 'hidden';

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    if (gig.status === 'completed') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#10B981', '#F59E0B'],
      });
    }
  }, [gig.status]);

  const handleAction = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (gig.status === 'in_progress' && isWorker && !workProof.trim()) {
      toast.error('Please provide proof of work');
      return;
    }
    onAccept?.(gig, workProof);
  };

  let actionLabel = 'Accept Gig';
  let showAction = true;

  if (gig.status === 'open') {
    actionLabel = isPoster ? 'Waiting for Workers' : `Accept Gig — ${formatCUSD(gig.bounty)}`;
    if (isPoster) showAction = false;
  } else if (gig.status === 'in_progress') {
    actionLabel = isWorker ? 'Submit Proof of Work' : 'In Progress';
    if (!isWorker) showAction = false;
  } else if (gig.status === 'submitted') {
    actionLabel = isPoster ? 'Release Funds' : 'Pending Review';
    if (!isPoster) showAction = false;
  } else if (gig.status === 'completed') {
    actionLabel = 'Job Completed';
    showAction = false;
  } else if (gig.status === 'disputed') {
    actionLabel = 'Under Dispute';
    showAction = false;
  }

  const canDispute =
    (gig.status === 'submitted' || gig.status === 'in_progress') && (isPoster || isWorker);

  if (!isMounted) return null;

  const modalContent = (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} glass`} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.catBadge}>
            <cat.Icon size={14} />
            {cat.label}
          </span>
          <span className={styles.bountyBig}>{formatCUSD(gig.bounty)}</span>
        </div>

        <h2 className={styles.title}>{gig.title}</h2>

        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <Clock size={14} /> {gig.timeEstimate || '3h'}
          </span>
          <span 
            className={styles.metaItem} 
            style={{ cursor: 'pointer' }}
            onClick={() => {
              navigator.clipboard.writeText(gig.poster);
              toast.success('Address copied!');
            }}
            title="Click to copy full address"
          >
            <User size={14} /> {shortenAddress(gig.poster)}
          </span>
          <span className={styles.metaItem}>{timeAgo(gig.createdAt)}</span>
        </div>

        <div className={styles.divider} />

        <h4 className={styles.sectionLabel}>Description</h4>
        <p className={styles.description}>{gig.description}</p>

        {gig.status === 'submitted' && gig.deliverables && (
          <>
            <div className={styles.divider} />
            <h4 className={styles.sectionLabel}>Deliverables</h4>
            <div className={styles.deliverablesBox}>
              <p>{gig.deliverables}</p>
            </div>
          </>
        )}

        {gig.status === 'in_progress' && isWorker && (
          <>
            <div className={styles.divider} />
            <h4 className={styles.sectionLabel}>Submit Proof of Work</h4>
            <textarea
              className={styles.workProofInput}
              placeholder="Paste a link to your work (e.g. GitHub PR, Figma link, Google Doc) or describe what you completed..."
              value={workProof}
              onChange={(e) => setWorkProof(e.target.value)}
              rows={3}
            />
          </>
        )}

        {gig.verification !== 'none' && (
          <>
            <div className={styles.divider} />
            <div className={styles.verifyBanner}>
              {gig.verification === 'worldid' ? <Globe size={18} /> : <ShieldCheck size={18} />}
              <div>
                <strong>Identity Verification Required</strong>
                <p>
                  A {gig.verification === 'worldid' ? 'World ID' : 'Self Protocol'} check is
                  required for this market.
                </p>
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
            <div
              className={`${styles.statusBadge} ${gig.status === 'disputed' ? styles.disputed : ''}`}
            >
              <CheckCircle size={18} /> {actionLabel}
            </div>
          )}

          {canDispute && (
            <button className={styles.disputeBtn} onClick={() => setShowDispute(true)}>
              Raise Dispute
            </button>
          )}
          <button
            className={styles.viewChainBtn}
            onClick={() => window.open(`https://celoscan.io/address/${address}`, '_blank')}
          >
            <ExternalLink size={14} /> View Explorer
          </button>
        </div>
      </div>

      {showDispute && (
        <DisputeModal
          gigId={gig.id}
          onClose={() => setShowDispute(false)}
          onSubmit={async (reason, evidence) => {
            await new Promise((r) => setTimeout(r, 1000));
            toast.success('Dispute submitted successfully');
            setShowDispute(false);
            onClose();
          }}
        />
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
}
