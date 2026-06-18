'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import styles from './FAB.module.css';

interface FABProps {
  onClick: () => void;
}

export default function FAB({ onClick }: FABProps) {
  return (
    <button className={styles.fab} onClick={onClick} aria-label="Create Gig">
      <Plus size={24} />
    </button>
  );
}

// EOF update 1781801922749
