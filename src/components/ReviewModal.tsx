'use client';

import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import StarRating from './StarRating';
import styles from './ReviewModal.module.css';

interface ReviewModalProps {
  gigTitle: string;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => Promise<void>;
}

export default function ReviewModal({ gigTitle, onClose, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return; // Basic validation
    setIsSubmitting(true);
    try {
      await onSubmit(rating, reviewText);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Rate this worker';
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} anim-scale-up`} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Leave a Review</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p className={styles.label}>For: {gigTitle}</p>

        <div className={styles.ratingSection}>
          <StarRating rating={rating} onChange={setRating} size={32} />
          <span className={styles.ratingLabel}>{getRatingLabel(rating)}</span>
        </div>

        <label className={styles.label} htmlFor="review">
          Written Feedback (Optional)
        </label>
        <textarea
          id="review"
          className={styles.textarea}
          placeholder="What was it like working with them?"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          disabled={isSubmitting}
        />

        <button 
          className={`btn-primary ${styles.submitBtn}`} 
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : (
            <>
              Submit Review <Send size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
