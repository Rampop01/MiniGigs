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
          <p>Gig #{gigId}</p>
        </div>
      </div>
    </div>
  );
}
