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

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
