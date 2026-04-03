'use client';

import { GIG_CATEGORIES } from '@/lib/constants';
import styles from './CategoryFilter.module.css';

interface CategoryFilterProps {
    selected: string;
    onChange: (id: string) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
    return (
        <div className={styles.wrap}>
            <button
                className={selected === 'all' ? styles.chipActive : styles.chip}
                onClick={() => onChange('all')}
            >
                All
            </button>
            {GIG_CATEGORIES.map(cat => (
                <button
                    key={cat.id}
                    className={selected === cat.id ? styles.chipActive : styles.chip}
                    onClick={() => onChange(cat.id)}
                >
                    <span>{cat.emoji}</span> {cat.label}
                </button>
            ))}
        </div>
    );
}
