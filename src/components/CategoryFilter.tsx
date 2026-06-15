'use client';

import { GIG_CATEGORIES } from '@/lib/constants';
import { getCategoryInfo } from '@/lib/utils';
import styles from './CategoryFilter.module.css';

interface CategoryFilterProps {
  selected: string;
  onChange: (id: string) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className={styles.wrap} role="group" aria-label="Filter by category">
      <button
        className={selected === 'all' ? styles.chipActive : styles.chip}
        onClick={() => onChange('all')}
        aria-pressed={selected === 'all'}
      >
        All
      </button>
      {GIG_CATEGORIES.map((category) => {
        const info = getCategoryInfo(category.id);
        return (
          <button
            key={category.id}
            className={selected === category.id ? styles.chipActive : styles.chip}
            onClick={() => onChange(category.id)}
            aria-pressed={selected === category.id}
          >
            <info.Icon size={14} style={{ marginRight: '6px' }} />
            {category.label}
          </button>
        );
      })}
    </div>
  );
}

// EOF update 1781535793101
