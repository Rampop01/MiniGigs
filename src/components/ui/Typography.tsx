import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'body' | 'small' | 'large';
}

export const Heading = ({ children, className = '' }: TypographyProps) => (
  <h1 className={`text-2xl font-heading font-bold text-white tracking-tight ${className}`}>
    {children}
  </h1>
);

export const Subheading = ({ children, className = '' }: TypographyProps) => (
  <h2 className={`text-lg font-heading font-semibold text-white/90 ${className}`}>{children}</h2>
);

export const Text = ({ children, className = '', variant = 'body' }: TypographyProps) => {
  const sizes = {
    small: 'text-xs',
    body: 'text-sm',
    large: 'text-base',
  };
  return (
    <p className={`${sizes[variant]} font-body text-white/60 leading-relaxed ${className}`}>
      {children}
    </p>
  );
};

export const Label = ({ children, className = '' }: TypographyProps) => (
  <span
    className={`text-[10px] font-heading font-bold uppercase tracking-widest text-white/40 ${className}`}
  >
    {children}
  </span>
);

