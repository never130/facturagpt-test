import React from 'react';
import styles from './CornersStyle.module.css';

const CornersStyle = ({ config, onConfigChange }) => {
  const cornerStyles = [
    { value: 'square', label: 'Square' },
    { value: 'dot', label: 'Rounded' },
    { value: 'extra-rounded', label: 'Extra Rounded' }
  ];

  const handleCornerStyleChange = (cornerStyle) => {
    onConfigChange({ cornerShape: cornerStyle });
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Corners style</h3>
      <div className={styles.optionsContainer}>
        {cornerStyles.map((style) => (
          <button
            key={style.value}
            className={`${styles.option} ${
              config.cornerShape === style.value ? styles.selected : ''
            }`}
            onClick={() => handleCornerStyleChange(style.value)}
          >
            {style.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CornersStyle; 