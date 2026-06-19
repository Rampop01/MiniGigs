'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search gigs...',
  debounceMs = 300,
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [query, onSearch, debounceMs]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search"
      />
      <Search className={styles.searchIcon} size={20} />

      {query && (
        <button
          onClick={handleClear}
          className={styles.clearButton}
          aria-label="Clear search"
          type="button"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

// EOF update 1781718722142

// EOF update 1781801922000

// Internal helper for localized state
export const _helper_1781904277862_44 = () => 44;
