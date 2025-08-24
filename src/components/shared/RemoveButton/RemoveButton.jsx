import React from 'react';
import styles from './RemoveButton.module.css';

const RemoveButton = ({ onClick, className = '', ...props }) => {
  return (
    <button
      type="button"
      className={`${styles.removeButton} ${className}`}
      onClick={onClick}
      {...props}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.removeIcon}
      >
        <path
          d="M2 6H10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default RemoveButton; 