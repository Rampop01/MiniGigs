'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import styles from './StarRating.module.css';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  readonly?: boolean;
  onChange?: (rating: number) => void;
  size?: number;
}

export default function StarRating({ 
  rating, 
  maxStars = 5, 
  readonly = false, 
  onChange,
  size = 20 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index: number) => {
    if (!readonly) setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (!readonly) setHoverRating(0);
  };

  const handleClick = (index: number) => {
    if (!readonly && onChange) {
      onChange(index);
    }
  };

  return (
    <div 
      className={`${styles.starContainer} ${readonly ? styles.readonly : ''}`}
      onMouseLeave={handleMouseLeave}
    >
      {[...Array(maxStars)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= (hoverRating || rating);
        const isActive = !readonly && hoverRating === starValue;
        
        return (
          <Star
            key={i}
            size={size}
            className={`
              ${styles.star} 
              ${isFilled ? styles.starFilled : ''} 
              ${isActive ? styles.starActive : ''}
            `}
            fill={isFilled ? 'currentColor' : 'none'}
            strokeWidth={isFilled ? 0 : 2}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onClick={() => handleClick(starValue)}
            role={readonly ? 'img' : 'button'}
            aria-label={`${starValue} Star${starValue > 1 ? 's' : ''}`}
          />
        );
      })}
    </div>
  );
}
