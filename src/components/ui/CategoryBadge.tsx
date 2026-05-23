import React from 'react';
import styles from './CategoryBadge.module.css';

interface CategoryBadgeProps {
  category: string;
}

const CATEGORY_MAP: Record<string, { label: string; color: string }> = {
  translation: { label: 'Translation', color: '#3B82F6' },
  testing: { label: 'QA & Testing', color: '#10B981' },
  data: { label: 'Data Entry', color: '#F59E0B' },
  design: { label: 'Design', color: '#8B5CF6' },
  content: { label: 'Content', color: '#EC4899' },
  survey: { label: 'Survey', color: '#6366F1' },
};

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const config = CATEGORY_MAP[category.toLowerCase()] || { label: category, color: '#6B7280' };

  return (
    <span className={styles.badge} style={{ '--badge-color': config.color } as React.CSSProperties}>
      {config.label}
    </span>
  );
}
