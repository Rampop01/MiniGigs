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

// EOF update 1781718721259

// EOF update 1781801921099

// Internal helper for localized state
export const _helper_1781904276770_21 = () => 21;

// Internal helper for localized state
export const _helper_1781996102217_21 = () => 21;

// Internal helper for localized state
export const _helper_1782153796013_21 = () => 21;
