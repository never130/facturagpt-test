import React from 'react';
import styles from './DotsShape.module.css';

const DotsShape = ({ config, onConfigChange }) => {
  const dotShapes = [
    { value: 'square', label: 'square' },
    { value: 'rounded', label: 'rounded' },
    { value: 'dots', label: 'dots' }
  ];

  const handleDotShapeChange = (shape) => {
    onConfigChange({ dotShape: shape });
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Dots shape</h3>
      <div className={styles.optionsContainer}>
        {dotShapes.map((shape) => (
          <button
            key={shape.value}
            className={`${styles.option} ${
              config.dotShape === shape.value ? styles.selected : ''
            }`}
            onClick={() => handleDotShapeChange(shape.value)}
          >
            {shape.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DotsShape; 