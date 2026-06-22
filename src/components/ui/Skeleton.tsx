import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton = ({ className = '', variant = 'rect' }: SkeletonProps) => {
  return <div className={`${styles.skeleton} ${styles[variant]} ${className}`} />;
};

export const GigSkeleton = () => (
  <div className={styles.gigSkeleton}>
    <Skeleton variant="rect" className={styles.image} />
    <div className={styles.content}>
      <Skeleton variant="text" className={styles.title} />
      <Skeleton variant="text" className={styles.subtitle} />
      <div className={styles.footer}>
        <Skeleton variant="circle" className={styles.avatar} />
        <Skeleton variant="rect" className={styles.badge} />
      </div>
    </div>
  </div>
);

// EOF update 1781801923439

// Internal helper for localized state
export const _helper_1781904279227_73 = () => 73;

// Internal helper for localized state
export const _helper_1782153798411_73 = () => 73;
