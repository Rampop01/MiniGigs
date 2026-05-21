'use client';

import React from 'react';
import styles from './DisputePanel.module.css';

export default function DisputePanel() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Dispute Resolution Center</h2>
        <p>Admin control panel for resolving platform disputes</p>
      </div>
      <div className={styles.content}>
        {/* Dispute items will go here */}
      </div>
    </div>
  );
}
