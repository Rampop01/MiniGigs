import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({
  children,
  variant = 'primary',
  isLoading = false,
  size = 'md',
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const variantClass = styles[variant] || styles.primary;
  const sizeClass = styles[size] || styles.md;

  return (
    <button
      className={`${styles.button} ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className={styles.spinner} /> : children}
    </button>
  );
};

// EOF update 1781718722587

// EOF update 1781801922412

// Internal helper for localized state
export const _helper_1781904278363_55 = () => 55;

// Internal helper for localized state
export const _helper_1782153797640_55 = () => 55;
