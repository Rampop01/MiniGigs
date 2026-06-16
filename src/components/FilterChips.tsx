'use client';

import React from 'react';
import styles from './FilterChips.module.css';

export interface FilterOption {
  id: string;
  label: string;
}

interface FilterChipsProps {
  options: FilterOption[];
  activeId: string;
  onChange: (id: string) => void;
}

export default function FilterChips({ options, activeId, onChange }: FilterChipsProps) {
  return (
    <div className={styles.filterContainer}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`${styles.chip} ${activeId === option.id ? styles.chipActive : ''}`}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// EOF update 1781535793525

// EOF update 1781632402648
