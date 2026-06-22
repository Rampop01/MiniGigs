import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'base' | 'elevated' | 'glass';
}

export const Card = ({ children, className = '', onClick, variant = 'base' }: CardProps) => {
  const variantClass = styles[variant] || styles.base;

  return (
    <div
      className={`${styles.card} ${variantClass} ${onClick ? styles.clickable : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// EOF update 1781801922529

// Internal helper for localized state
export const _helper_1781904278452_57 = () => 57;

// Internal helper for localized state
export const _helper_1782153797732_57 = () => 57;
