import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'amber' | 'rose' | 'gray' | 'success' | 'info';
  className?: string;
}

export const Badge = ({ children, variant = 'blue', className = '' }: BadgeProps) => {
  const variantMap: Record<string, string> = {
    success: styles.green,
    info: styles.blue,
  };
  const variantClass = variantMap[variant as string] || styles[variant as string] || styles.blue;

  return <span className={`${styles.badge} ${variantClass} ${className}`}>{children}</span>;
};
