import React from 'react';
import BaseTooltip from './BaseTooltip';
import styles from './Tooltip.module.css';
import ratingStyles from './RatingTooltip.module.css';
// SVG paths will be defined inline for simplicity


const Star = ({ filled, partial = false }) => {
  return (
    <div className={ratingStyles.star}>
      {filled && !partial ? (
        <div className={ratingStyles.starFilled}>
          <svg viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFCC00" stroke="#2C2C2C" />
          </svg>
        </div>
      ) : partial ? (
        <div className={ratingStyles.starPartial}>
          <svg viewBox="0 0 24 24">
            <defs>
              <clipPath id="halfStar">
                <rect x="0" y="0" width="12" height="24" />
              </clipPath>
            </defs>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFCC00" clipPath="url(#halfStar)" />
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke="#2C2C2C" />
          </svg>
        </div>
      ) : null}
    </div>
  );
};


const RatingTooltip = ({ className }) => {
  return (
    <BaseTooltip className={className}>
      <div className={styles.fieldContainer}>
        <div className={styles.fieldRow}>
          <div className={styles.fieldContentStart}>
            <div className={ratingStyles.ratingContainer}>
              <div className={ratingStyles.ratingText}>
                (4.5)
              </div>
              <div className={ratingStyles.starsContainer}>
                <Star filled />
                <Star filled />
                <Star filled />
                <Star filled />
                <Star filled={false} partial />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseTooltip>
  );
};

export default RatingTooltip;