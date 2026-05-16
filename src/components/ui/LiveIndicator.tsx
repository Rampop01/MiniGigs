'use client';

import React from 'react';
import styles from './LiveIndicator.module.css';

export default function LiveIndicator() {
  return (
    <div className={styles.container}>
      <span className={styles.dot} />
      <span className={styles.text}>LIVE</span>
    </div>
  );
}
