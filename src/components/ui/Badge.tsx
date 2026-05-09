import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'amber' | 'rose' | 'gray';
  className?: string;
}

export const Badge = ({
  children,
  variant = 'blue',
  className = '',
}: BadgeProps) => {
  const variantClass = styles[variant] || styles.blue;

  return (
    <span className={`${styles.badge} ${variantClass} ${className}`}>
      {children}
    </span>
  );
};
