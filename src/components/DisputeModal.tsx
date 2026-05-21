'use client';

import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import styles from './DisputeModal.module.css';

interface DisputeModalProps {
  gigId: string;
  onClose: () => void;
  onSubmit: (reason: string, evidenceUrl: string) => Promise<void>;
}

export default function DisputeModal({ gigId, onClose, onSubmit }: DisputeModalProps) {
  const [reason, setReason] = useState('');
  const [evidence, setEvidence] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(reason, evidence);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} disabled={isSubmitting}>
          <X size={20} />
        </button>
        <div className={styles.header}>
          <div className={styles.iconBox}>
            <AlertTriangle size={24} color="var(--accent-rose)" />
          </div>
          <h2>Raise Dispute</h2>
        </div>
        <div className={styles.content}>
          <div className={styles.formGroup}>
            <label>Why are you disputing this gig?</label>
            <select
              className={styles.select}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Select a reason...</option>
              <option value="incomplete">Work is incomplete</option>
              <option value="poor_quality">Poor quality / Doesn't meet requirements</option>
              <option value="unresponsive">Worker is unresponsive</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>Evidence URL (Optional)</label>
            <input
              type="text"
              className={styles.input}
              placeholder="https://... (Screenshots, logs)"
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <button
            className="btn-primary"
            style={{ marginTop: '8px', background: 'var(--accent-rose)', borderColor: 'rgba(255,59,59,0.3)', color: '#fff', boxShadow: '0 0 15px rgba(255,59,59,0.2)', opacity: (!reason || isSubmitting) ? 0.5 : 1 }}
            disabled={!reason || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
          </button>
        </div>
      </div>
    </div>
  );
}
