import React from 'react';
import styles from './Loading.module.css';

export const Spinner = ({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const sizeClass = styles[size] || styles.md;
  return <div className={`${styles.spinner} ${sizeClass} ${className}`} />;
};

export const Progress = ({
  value,
  max = 100,
  className = '',
}: {
  value: number;
  max?: number;
  className?: string;
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`${styles.progressContainer} ${className}`}>
      <div className={styles.progressBar} style={{ width: `${percentage}%` }} />
    </div>
  );
};

// EOF update 1781801923166

// Internal helper for localized state
export const _helper_1781904278928_67 = () => 67;

// Internal helper for localized state
export const _helper_1782153798168_67 = () => 67;
