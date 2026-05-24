'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import styles from './SortDropdown.module.css';

export interface SortOption {
  id: string;
  label: string;
}

interface SortDropdownProps {
  options: SortOption[];
  activeId: string;
  onChange: (id: string) => void;
  label?: string;
  alignLeft?: boolean;
}

export default function SortDropdown({
  options,
  activeId,
  onChange,
  label,
  alignLeft = false,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeOption = options.find((opt) => opt.id === activeId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const displayLabel = label
    ? `${label}: ${activeOption?.label || ''}`
    : activeOption?.label || 'Sort By';

  return (
    <div className={styles.sortContainer} ref={dropdownRef}>
      <button
        type="button"
        className={styles.sortButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{displayLabel}</span>
        <ChevronDown size={14} className={isOpen ? styles.chevronOpen : ''} />
      </button>

      {isOpen && (
        <div
          className={styles.dropdownMenu}
          style={alignLeft ? { left: 0, right: 'auto' } : { right: 0, left: 'auto' }}
          role="listbox"
        >
          {options.map((option) => (
            <button
              key={option.id}
              role="option"
              aria-selected={activeId === option.id}
              className={`${styles.dropdownItem} ${activeId === option.id ? styles.itemActive : ''}`}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
            >
              <span>{option.label}</span>
              {activeId === option.id && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
